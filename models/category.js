'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema (
  {
    name: {type: String, required: true, min: 3, max: 100},

  }
);

CategorySchema
  .virtual('url')
  .get(function () {
    return '/catalog/category/' + this._id;
  });

module.exports = mongoose.model('Category', CategorySchema)