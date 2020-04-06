'use strict'

// const mongoose = require('mongoose')
const Product = require('../models/product')
const Brand = require('../models/brand')
const Category = require('../models/category')

const validator = require('express-validator')

exports.index = function (req, res, next) {
  const productCountQuery = Product.countDocuments()
  const brandCountQuery = Brand.countDocuments()
  const categoryCountQuery = Category.countDocuments()

  Promise.all([productCountQuery, brandCountQuery, categoryCountQuery])
    .then((results) => {
      const data = {
        title: 'Skate Shop Inventory',
        productCount: results[0],
        brandCount: results[1],
        categoryCount: results[2]
      }

      res.render('index', data)
    })
    .catch((err) => {
      return next(err)
    })
}

// Display list of all products.
exports.product_list = function (req, res, next) {
  Product.find()
    .populate('category')
    .populate('brand')
    .exec()
    .then((listProducts) => {
      const data = {
        title: 'Product List',
        product_list: listProducts
      }
      res.render('product_list', data)
    })
    .catch((err) => {
      return next(err)
    })
}

// Display detail page for a specific product.
exports.product_detail = function (req, res, next) {
  Product.findById(req.params.id)
    .populate('category')
    .populate('brand')
    .then((product) => {
      if (!product) { // No results.
        var err = new Error('product not found')
        err.status = 404
        return next(err)
      }
      // Successful, so render.
      const data = {
        title: product.name,
        product: product
      }
      res.render('product_detail', data)
    })
    .catch((err) => {
      next(err)
    })
}

// Display product create form on GET.
exports.product_create_get = function (req, res, next) {
  const brandQuery = Brand.find()
  const categoryQuery = Category.find()

  Promise.all([brandQuery, categoryQuery])
    .then((results) => {
      const brands = results[0]
      const categories = results[1]

      const data = {
        title: 'Create Product',
        brands: brands,
        categories: categories
      }

      res.render('product_form', data)
    })

    .catch((error) => {
      next(error)
    })
}

// Handle product create on POST.
exports.product_create_post = [

  // Validate fields.
  validator.check('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('brand', 'Brand must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('price', 'Price must not be empty').isLength({ min: 1 }).trim(),
  validator.check('stock', 'Stock must not be empty').isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcard).
  validator.sanitizeBody('*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req)

    // Create a Product object with escaped and trimmed data.
    const product = new Product(
      {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        brand: req.body.brand,
        price: req.body.price,
        stock: req.body.stock
      })

    if (!errors.isEmpty()) {
      res.redirect('/catalog/product/create')
    } else {
      // Data from form is valid. Save product.
      product.save(function (err) {
        if (err) { return next(err) }
        // successful - redirect to new product record.
        res.redirect(product.url)
      })
    }
  }
]

// Display product delete form on GET.
exports.product_delete_get = function (req, res, next) {
  Product.findById(req.params.id)
    .exec()

    .then((results) => {
      const products = results

      if (products == null) { // No results.
        res.redirect('/catalog/product')
      }

      const data = {
        title: 'Delete product',
        product: products
      }
      res.render('product_delete', data)
    })
    .catch((error) => {
      next(error)
    })
}

// Handle product delete on POST.
exports.product_delete_post = function (req, res, next) {
  Product.findById(req.params.id)
    .exec()

    .then((results) => {
      const product = results

      if (product == null) { // No results.
        res.redirect('/catalog/product')
      } else {
        // Category has no products. Delete object and redirect to the list of categories.
        Product.findByIdAndRemove(product, function deleteProduct (err) {
          if (err) { return next(err) }
          // Success - go to category list
          res.redirect('/catalog/product')
        })
      }
    })
    .catch((error) => {
      next(error)
    })
}

// Display product update form on GET.
exports.product_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Product update GET')
}

// Handle product update on POST.
exports.product_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Product update POST')
}
