'use strict'

const Brand = require('../models/brand')
const Product = require('../models/product')

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
  const brandQuery = Brand.findById(req.params.id).exec()
  const productsQuery = Product.find({ brand: req.params.id }).exec()

  Promise.all([brandQuery, productsQuery])
    .then((results) => {
      const brand = results[0]
      const products = results[1]
      if (!brand) { // No results.
        const err = new Error('Brand not found')
        err.status = 404
        return next(err)
      }
      // Successful, so render
      const data = {
        title: 'Brand Detail',
        brand: brand,
        brand_products: products
      }
      res.render('brand_detail', data)
    })
    .catch((error) => {
      next(error)
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
      // There are errors.
      res.redirect('/catalog/brand/create')
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
exports.brand_delete_get = function (req, res, next) {
  const brandQuery = Brand.findById(req.params.id).exec()
  const productQuery = Product.find({ brand: req.params.id }).exec()

  Promise.all([brandQuery, productQuery])
    .then((results) => {
      const brands = results[0]
      const products = results[1]

      if (brands == null) { // No results.
        res.redirect('/catalog/brand')
      }

      const data = {
        title: 'Delete brand',
        brand: brands,
        brand_products: products
      }
      res.render('brand_delete', data)
    })
    .catch((error) => {
      next(error)
    })
}

// Handle Brand delete on POST.
exports.brand_delete_post = function (req, res, next) {
  const brandQuery = Brand.findById(req.body.brandid).exec()
  const productQuery = Product.find({ brand: req.body.brandid }).exec()

  Promise.all([brandQuery, productQuery])
    .then((results) => {
      const brand = results[0]
      const products = results[1]

      if (brand == null) { // No results.
        res.redirect('/catalog/brand')
      }

      if (products.length > 0) {
        const data = {
          title: 'Delete Brand',
          brand: brand,
          brand_products: products
        }
        res.render('brand_delete', data)
      } else {
        // Category has no products. Delete object and redirect to the list of categories.
        Brand.findByIdAndRemove(brand, function deleteBrand (err) {
          if (err) { return next(err) }
          // Success - go to category list
          res.redirect('/catalog/brand')
        })
      }
    })
    .catch((error) => {
      next(error)
    })
}

// Display Brand update form on GET.
exports.brand_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Brand update GET')
}

// Handle Brand update on POST.
exports.brand_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Brand update POST')
}
