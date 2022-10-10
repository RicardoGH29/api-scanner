const S3 = require('aws-sdk/clients/s3');
const Model = require('./model');

async function addInvoice(invoice) {
  const { images } = invoice;
  const prevInvoice = { ...invoice };
  delete prevInvoice.images;
  const newInvoice = new Model(invoice);
  const result = await newInvoice.save();

  // eslint-disable-next-line no-underscore-dangle
  const id = result._id;
  const { companyId } = invoice;

  const foundInvoice = await Model.findOne({
    _id: id,
  });

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
  });

  const myBucket = 'invoices';

  const photos = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const image of images) {
    const fileName = `company/${companyId}/invoices/${id}/images/${image.name}`;

    const sizeReal = image.images.find(imageSize => imageSize.origin).image;

    const bufferReal = Buffer.from(
      sizeReal.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const paramsOfRealImage = {
      Bucket: myBucket,
      Key: fileName,
      Body: bufferReal,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      // ACL: 'authenticated-read',
    };

    const realImage = await s3.upload(paramsOfRealImage).promise();

    photos.push({
      ...realImage,
      real: true,
      name: image.name,
    });
  }

  foundInvoice.photos = photos;

  await foundInvoice.save();

  return Model.findOne({
    _id: id,
  });
}

function listInvoices(invoiceId, companyId) {
  return new Promise((resolve, reject) => {
    let filter = {};
    if (invoiceId) {
      filter = {
        _id: invoiceId,
      };
    }

    filter.company = companyId;
    filter.disable = false;

    Model.find(filter)
      .populate('createdBy')
      .populate('company')
      .exec((err, populated) => {
        if (err) {
          reject(err);
          return false;
        }
        resolve(populated);
        return true;
      });
  });
}

async function updateInvoice(invoiceId, data) {
  const foundInvoice = await Model.findOne({
    _id: invoiceId,
  });

  const { name = '', photo = '' } = data;

  if (name) {
    foundInvoice.name = name;
  }
  if (photo) {
    foundInvoice.photo = name;
  }

  foundInvoice.updated = true;
  foundInvoice.updatedAt = new Date();

  return foundInvoice.save();
}

async function removeInvoice(invoiceId) {
  const foundInvoice = await Model.findOne({
    _id: invoiceId,
  });

  foundInvoice.disable = true;

  return foundInvoice.save();
}

module.exports = {
  add: addInvoice,
  list: listInvoices,
  update: updateInvoice,
  remove: removeInvoice,
};
