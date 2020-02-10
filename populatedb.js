'use strict'

// #! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true')

// Get arguments passed on command line
const userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Product = require('./models/product')
const Brand = require('./models/brand')
const Category = require('./models/category')

const mongoose = require('mongoose')
const mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const brands = []
const categories = []
const products = []

function brandCreate (name, cb) {
  const brand = new Brand({ name: name })

  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand)
    brands.push(brand)
    cb(null, brand)
  })
}

function categoryCreate (name, cb) {
  const category = new Category({ name: name })

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category)
    categories.push(category)
    cb(null, category)
  })
}

function productCreate (name, category, description, brand, price, stock, cb) {
  const productdetail = {
    name: name,
    category: category,
    description: description,
    brand: brand,
    price: price,
    stock: stock
  }
  const product = new Product(productdetail)
  console.log(product)
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Product: ' + product)
    products.push(product)
    cb(null, product)
  })
}

function deleteBrands (callback) {
  Brand.remove(callback)
}

function deleteCategories (callback) {
  Category.remove(callback)
}

function deleteProducts (callback) {
  Product.remove(callback)
}

function createBrands (cb) {
  async.parallel([
    function (callback) {
      brandCreate('Carver', callback)
    },
    function (callback) {
      brandCreate('Welcome', callback)
    },
    function (callback) {
      brandCreate('Misstee', callback)
    },
    function (callback) {
      brandCreate('Enjoy', callback)
    },
    function (callback) {
      brandCreate('Girl', callback)
    }
  ],
  // optional callback
  cb)
}

function createCategories (cb) {
  async.parallel([
    function (callback) {
      categoryCreate('Decks', callback)
    },
    function (callback) {
      categoryCreate('Parts', callback)
    },
    function (callback) {
      categoryCreate('Grip', callback)
    }
  ],

  cb)
}

function createProducts (cb) {
  async.parallel([
    function (callback) {
      productCreate('Girl Wilson Hello Kitty', categories[0], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.', brands[0], 50, 12, callback)
    },
    function (callback) {
      productCreate('Enjoi Cock A Doodle Doo 8.25', categories[0], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.', brands[0], 90, 10, callback)
    },
    function (callback) {
      productCreate('Carver C5 street', categories[1], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.', brands[1], 120, 3, callback)
    },
    function (callback) {
      productCreate('COURTNEY CONLOGUE 29,5', categories[1], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.', brands[0], 120, 4, callback)
    },
    function (callback) {
      productCreate('Test Product 1', categories[2], 'Summary of test product 1', brands[0], 40, 12, callback)
    },
    function (callback) {
      productCreate('Test Product 2', categories[2], 'Summary of test product 2', brands[0], 40, 30, callback)
    }
  ],
  // optional callback
  cb)
}

async.series([
  deleteBrands,
  deleteCategories,
  deleteProducts,
  createBrands,
  createCategories,
  createProducts
],
// Optional callback
function (err, results) {
  if (err) {
    console.log('FINAL ERR: ' + err)
  } else {
    console.log('products: ' + products)
    console.log(brands, categories)
  }
  // All done, disconnect from database
  mongoose.connection.close()
})
