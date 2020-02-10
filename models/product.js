'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    price: { type: Number, get: formatCurrency, required: true },
    stock: { type: Number, required: true }
  }
)

function formatCurrency (price) {
  return (new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price))
}

// Virtual for product's URL
ProductSchema
  .virtual('url')
  .get(function () {
    return '/catalog/product/' + this._id
  })

// Export model
module.exports = mongoose.model('Product', ProductSchema)
