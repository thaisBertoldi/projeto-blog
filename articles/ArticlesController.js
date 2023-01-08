const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');

router.get('/articles', (req, res) => {
    res.send('Rota artigo')
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new-articles', { categories: categories })
    })
});

module.exports = router;