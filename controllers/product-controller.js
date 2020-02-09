'use strict'

// const ObjectId = require('mongoose').Types.ObjectId;

// const mongoose = require('mongoose')
const Product = require('../models/product');
const Brand = require('../models/brand');
const Category = require('../models/category');

const async = require('async');


exports.index = function(req, res) {   
    
  async.parallel({
      product_count: function(callback) {
          Product.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      brand_count: function(callback) {
          Brand.countDocuments({}, callback);
      },
      category_count: function(callback) {
          Category.countDocuments({}, callback);
      }
  }, function(err, results) {
      res.render('index', { title: 'Skate Shop Inventory', error: err, data: results });
  });
};

// Display list of all products.
exports.product_list = function(req, res, next) {
    const promise = Product.find()
        .populate('category')
        .populate('brand')
        .exec()

    promise.then((list_products) => {
        res.render('product_list', { title: 'Product List', product_list: list_products });
    })

    promise.catch((err) => {
        return next(err);
    })
   
};

// Display detail page for a specific product.
exports.product_detail = function(req, res, next) {

    Product.findById(req.params.id)
        .populate('category')
        .populate('brand')
        .then((product) => {
            if (!product) { // No results.
                var err = new Error('product not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            console.log('req.params.id ',req.params.id)
            const data = {
            title: product.name,
            product: product
            }
            res.render('product_detail', data);
        })
        .catch((err) => {
            next(err);
        })


};

// Display product create form on GET.
exports.product_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Product create GET');
};

// Handle product create on POST.
exports.product_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Product create POST');
};

// Display product delete form on GET.
exports.product_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Product delete GET');
};

// Handle product delete on POST.
exports.product_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Product delete POST');
};

// Display product update form on GET.
exports.product_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Product update GET');
};

// Handle product update on POST.
exports.product_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Product update POST');
};