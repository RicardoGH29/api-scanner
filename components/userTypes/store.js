const Model = require('./model');

function addType(type) {
  const newUser = new Model(type);
  return newUser.save();
}

function listTypes(typeId, companyId) {
  return new Promise((resolve, reject) => {
    let filter = {};
    if (typeId) {
      filter = {
        _id: typeId,
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

async function updateType(typeId, type) {
  const foundBrand = await Model.findOne({
    _id: typeId,
  });

  const { name = '' } = type;

  if (name) {
    foundBrand.name = name;
  }

  foundBrand.updated = true;
  foundBrand.updatedAt = new Date();

  return foundBrand.save();
}

async function removeType(typeId) {
  const foundBrand = await Model.findOne({
    _id: typeId,
  });

  foundBrand.disable = true;

  return foundBrand.save();
}

module.exports = {
  add: addType,
  list: listTypes,
  update: updateType,
  remove: removeType,
};
