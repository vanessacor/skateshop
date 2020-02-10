'use strict'

const Brand = require('../models/brand')
const Product = require('../models/product')

const async = require('async')
const validator = require('express-validator')

// Display list of all Brand.
exports.brand_list = function (req, res, next) {
  Brand.find()
    .sort([['name', 'ascending']])
    .exec(function (err, brands) {
      if (err) { return next(err) }
      const data = {
        title: 'Brand List',
        brands: brands
      }
      // Successful, so render
      res.render('brand_list', data)
    })
}

// Display detail page for a specific Brand.
exports.brand_detail = function (req, res, next) {
  async.parallel({
    brand: function (callback) {
      Brand.findById(req.params.id)
        .exec(callback)
    },

    brand_products: function (callback) {
      Product.find({ brand: req.params.id })
        .exec(callback)
    }

  }, function (err, results) {
    if (err) { return next(err) }
    if (results.brand == null) { // No results.
      const error = new Error('Brand not found')
      error.status = 404
      return next(error)
    }
    // Successful, so render
    console.log('req.params.id ', req.params.id)
    const data = {
      title: 'Brand Detail',
      brand: results.brand,
      brand_products: results.brand_products
    }
    res.render('brand_detail', data)
  })
}

// Display Brand create form on GET.
exports.brand_create_get = function (req, res, next) {
  res.render('brand_form', { title: 'Create Brand' })
}

// Handle Brand create on POST.
exports.brand_create_post = [

  // Validate that the name field is not empty.
  validator.body('name', 'Brand name required').isLength({ min: 1 }).trim(),

  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req)

    // Create a brand object with escaped and trimmed data.
    const brand = new Brand(
      { name: req.body.name }
    )

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('brand_form', { title: 'Create Brand', brand: brand, errors: errors.array() })
    } else {
      // Data from form is valid.
      // Check if brand with same name already exists.
      Brand.findOne({ name: req.body.name })
        .exec(function (err, foundBrand) {
          if (err) { return next(err) }

          if (foundBrand) {
            // brand exists, redirect to its detail page.
            res.redirect(foundBrand.url)
          } else {
            brand.save(function (err) {
              if (err) { return next(err) }
              // brand saved. Redirect to brand detail page.
              res.redirect(brand.url)
            })
          }
        })
    }
  }
]

// Display Brand delete form on GET.
exports.brand_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Brand delete GET')
}

// Handle Brand delete on POST.
exports.brand_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Brand delete POST')
}

// Display Brand update form on GET.
exports.brand_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Brand update GET')
}

// Handle Brand update on POST.
exports.brand_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Brand update POST')
}
