const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home route - show all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('home', { products });
});

// Add to cart (Buy Now)
router.post('/add-to-cart', async (req, res) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.send('Product not found');

    if (!req.session.cart) req.session.cart = [];

    req.session.cart.push(product);
    req.session.message = 'You bought this product successfully!';
    res.redirect('/');
});

// View cart
router.get('/cart', (req, res) => {
    res.render('cart');
});

// Remove item from cart
router.post('/remove-from-cart', (req, res) => {
    const index = parseInt(req.body.index);
    if (req.session.cart && req.session.cart.length > index) {
        req.session.cart.splice(index, 1); // remove item by index
        req.session.message = 'Item removed from cart.';
    }
    res.redirect('/cart');
});

module.exports = router;
