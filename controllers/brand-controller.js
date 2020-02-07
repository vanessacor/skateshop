'use strict'

const ObjectId = require('mongoose').Types.ObjectId

const Brand = require('../models/brand');
const Product = require('../models/product');

const async = require('async')

// Display list of all Brand.
exports.brand_list = function(req, res) {
    Brand.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_brands) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('brand_list', { title: 'Brand List', brand_list: list_brands });
    });
};

// Display detail page for a specific Brand.
exports.brand_detail = function(req, res, next) {
    async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id)
              .exec(callback);
        },

        brand_products: function(callback) {
            Product.find({ 'brand': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) { // No results.
            var err = new Error('Brand not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        console.log('req.params.id ',req.params.id)
        const data = { 
            title: 'Brand Detail', 
            brand: results.brand, 
            brand_products: results.brand_products 
        }
        res.render('brand_detail', data);
    });
};

// Display Brand create form on GET.
exports.brand_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Brand create GET');
};

// Handle Brand create on POST.
exports.brand_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Brand create POST');
};

// Display Brand delete form on GET.
exports.brand_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Brand delete GET');
};

// Handle Brand delete on POST.
exports.brand_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Brand delete POST');
};

// Display Brand update form on GET.
exports.brand_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Brand update GET');
};

// Handle Brand update on POST.
exports.brand_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Brand update POST');
};