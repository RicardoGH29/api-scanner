const mongoose = require('mongoose');

const { Schema } = mongoose;

const mySchema = new Schema({
  nameOfPC: String,
  device: String,
  sucursal: String,
  ip: String,
  folio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photo: String,
  disable: {
    type: Boolean,
    default: false,
  },
  updated: {
    type: Boolean,
    default: false,
  },
  updatedAt: Date,
});

const model = mongoose.model('Invoice', mySchema, 'invoice');
module.exports = model;
