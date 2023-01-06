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

router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', { categories: categories });
    });
});

router.post('/categories/delete', (req, res) => {
    const id = req.body.id;
    if(id != undefined && !isNaN(id)) {
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories');
    }
});

module.exports = router;
