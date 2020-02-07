'use strict'

const express = require('express');
const router = express.Router();

// Require controller modules.
const productController = require('../controllers/product-controller');
const categoryController = require('../controllers/category-controller');
const brandController = require('../controllers/brand-controller');

/// PRODUCT ROUTES ///

// GET catalog home page.
router.get('/', productController.index);

// GET request for creating a product. NOTE This must come before routes that display product (uses id).
router.get('/product/create', productController.product_create_get);

// POST request for creating product.
router.post('/product/create', productController.product_create_post);

// GET request to delete product.
router.get('/product/:id/delete', productController.product_delete_get);

// POST request to delete product.
router.post('/product/:id/delete', productController.product_delete_post);

// GET request to update product.
router.get('/product/:id/update', productController.product_update_get);

// POST request to update product.
router.post('/product/:id/update', productController.product_update_post);

// GET request for one product.
router.get('/product/:id', productController.product_detail);

// GET request for list of all product items.
router.get('/product', productController.product_list);

/// CATEGORY ROUTES ///

// GET request for creating Category. NOTE This must come before route for id (i.e. display category).
router.get('/category/create', categoryController.category_create_get);

// POST request for creating category.
router.post('/category/create', categoryController.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', categoryController.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', categoryController.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', categoryController.category_update_get);

// POST request to update category.
router.post('/category/:id/update', categoryController.category_update_post);

// GET request for one category.
router.get('/category/:id', categoryController.category_detail);

// GET request for list of all categories.
router.get('/category', categoryController.category_list);

/// Brands ROUTES ///

// GET request for creating a brand. NOTE This must come before route that displays brand (uses id).
router.get('/brand/create', brandController.brand_create_get);

//POST request for creating brand.
router.post('/brand/create', brandController.brand_create_post);

// GET request to delete brand.
router.get('/brand/:id/delete', brandController.brand_delete_get);

// POST request to delete brand.
router.post('/brand/:id/delete', brandController.brand_delete_post);

// GET request to update brand.
router.get('/brand/:id/update', brandController.brand_update_get);

// POST request to update brand.
router.post('/brand/:id/update', brandController.brand_update_post);

// GET request for one brand.
router.get('/brand/:id', brandController.brand_detail);

// GET request for list of all brand.
router.get('/brand', brandController.brand_list);


module.exports = router;
