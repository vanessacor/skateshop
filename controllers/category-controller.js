'use strict'

const Category = require('../models/category')
const Product = require('../models/product')

const validator = require('express-validator')

// Display list of all Categoies.
exports.category_list = function (req, res, next) {
  Category.find()
    .sort([['name', 'ascending']])
    .exec(function (err, categories) {
      if (err) { return next(err) }
      // Successful, so render
      const data = {
        title: 'Category List',
        categories: categories
      }
      res.render('category_list', data)
    })
}

// Display detail page for a specific Category.
exports.category_detail = function (req, res, next) {
  const categoryQuery = Category.findById(req.params.id).exec()
  const productsQuery = Product.find({ category: req.params.id }).exec()

  Promise.all([categoryQuery, productsQuery])
    .then((results) => {
      const category = results[0]
      const products = results[1]
      if (!category) { // No results.
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
      }
      // Successful, so render
      const data = {
        title: 'Category Detail',
        category: category,
        category_products: products
      }
      res.render('category_detail', data)
    })
    .catch((error) => {
      next(error)
    })
}

// Display Category create form on GET.
exports.category_create_get = function (req, res, next) {
  res.render('category_form', { title: 'Create Category' })
}

// Handle category create on POST.
exports.category_create_post = [
  // Validate that the name field is not empty.
  validator.body('name', 'Category name required').isLength({ min: 1 }).trim(),

  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req)

    // Create a category object with escaped and trimmed data.
    const category = new Category(
      { name: req.body.name }
    )

    if (!errors.isEmpty()) {
      // There are errors.
      res.redirect('/catalog/category/create')
    } else {
      // Data from form is valid.
      // Check if category with same name already exists.
      Category.findOne({ name: req.body.name })
        .exec(function (err, foundCategory) {
          if (err) { return next(err) }

          if (foundCategory) {
            // category exists, redirect to its detail page.
            res.redirect(foundCategory.url)
          } else {
            category.save(function (err) {
              if (err) { return next(err) }
              // category saved. Redirect to category detail page.
              res.redirect(category.url)
            })
          }
        })
    }
  }
]

// Display category delete form on GET.
exports.category_delete_get = function (req, res, next) {
  const categoryQuery = Category.findById(req.params.id).exec()
  const productQuery = Product.find({ category: req.params.id }).exec()

  Promise.all([categoryQuery, productQuery])
    .then((results) => {
      const categories = results[0]
      const products = results[1]

      if (categories == null) { // No results.
        res.redirect('/catalog/category')
      }

      const data = {
        title: 'Delete Category',
        category: categories,
        category_products: products
      }
      res.render('category_delete', data)
    })
    .catch((error) => {
      next(error)
    })
}

// Handle category delete on POST.
exports.category_delete_post = function (req, res, next) {
  const categoryQuery = Category.findById(req.body.categoryid).exec()
  const productQuery = Product.find({ category: req.body.categoryid }).exec()

  Promise.all([categoryQuery, productQuery])
    .then((results) => {
      const category = results[0]
      const products = results[1]

      if (category == null) { // No results.
        res.redirect('/catalog/category')
      }

      if (products.length > 0) {
        const data = {
          title: 'Delete Category',
          category: category,
          category_products: products
        }
        res.render('category_delete', data)
      } else {
        // Category has no products. Delete object and redirect to the list of categories.
        Category.findByIdAndRemove(category, function deleteCategory (err) {
          if (err) { return next(err) }
          // Success - go to category list
          res.redirect('/catalog/category')
        })
      }
    })
    .catch((error) => {
      next(error)
    })
}

// Display category update form on GET.
exports.category_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: category update GET')
}

// Handle category update on POST.
exports.category_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: category update POST')
}
