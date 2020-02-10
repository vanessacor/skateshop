'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var BrandSchema = new Schema(
  {
    name: { type: String, required: true, max: 100 }

  }
)

// Virtual for brand's URL
BrandSchema
  .virtual('url')
  .get(function () {
    return '/catalog/brand/' + this._id
  })

// Export model
module.exports = mongoose.model('Brand', BrandSchema)
