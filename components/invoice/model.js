const mongoose = require('mongoose');

const { Schema } = mongoose;

const mySchema = new Schema({
  name: String,
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
  createdBy: {
    type: Schema.ObjectId,
    ref: 'Users',
  },
  company: {
    type: Schema.ObjectId,
    ref: 'Companies',
  },
});

const model = mongoose.model('Invoice', mySchema, 'invoice');
module.exports = model;
