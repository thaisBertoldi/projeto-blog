const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/categories', (req, res) => {
    res.send('Rota categorias')
});

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new-categorie');
});

router.post('/categories/save', (req, res) => {
    if (req.body.title !== undefined) {
        Category.create({
            title: req.body.title,
            slug: slugify(req.body.title)
        }).then(() => {
            res.redirect('/');
        })
    } else {
        res.redirect('/admin/categories/new');
    }
});

module.exports = router;
