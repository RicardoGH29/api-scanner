const fs = require("fs");
const {v4 : uuid} = require('uuid');
const Model = require('./model');

async function addInvoice(invoice) {
  const { image, nameOfPC } = invoice;
  const prevInvoice = { ...invoice };
  delete prevInvoice.images;
  const newInvoice = new Model(invoice);
  const result = await newInvoice.save();

  // eslint-disable-next-line no-underscore-dangle
  const id = result._id;

  const foundInvoice = await Model.findOne({
    _id: id,
  });

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const fullDate = `${year}-${month}-${day}`;

  const path = process.cwd()

  const newPath = `${path}/scan/${fullDate}/${nameOfPC}/${uuid()}.jpg`
  const directoryPath = `${path}/scan/${fullDate}/${nameOfPC}`

  if (!fs.existsSync(directoryPath)){
    await fs.mkdirSync(directoryPath, { recursive: true });
  }

  const buffer = Buffer.from(image, "base64");
  await fs.writeFileSync(newPath, buffer);

  foundInvoice.photo = newPath;

  await foundInvoice.save();

  return Model.findOne({
    _id: id,
  });
}

function listInvoices(invoiceId) {
  return new Promise((resolve, reject) => {
    let filter = {};
    if (invoiceId) {
      filter = {
        _id: invoiceId,
      };
    }

    filter.disable = false;

    Model.find(filter)
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
