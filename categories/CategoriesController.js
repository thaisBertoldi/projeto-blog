const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/categories', (req, res) => {
    res.send('Rota categorias')
});

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new-categorie');
});

router.post('/categories/save', adminAuth, (req, res) => {
    if (req.body.title !== undefined) {
        Category.create({
            title: req.body.title,
            slug: slugify(req.body.title)
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', { categories: categories });
    });
});

router.post('/categories/delete', adminAuth, (req, res) => {
    const id = req.body.id;
    if(id !== undefined && !isNaN(id)) {
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

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    Category.findByPk(req.params.id)
    .then(category => {
        if(category !== undefined && !isNaN(req.params.id)) {
            res.render('admin/categories/edit', { category: category });
        } else {
            res.redirect('/admin/categories');
        }
    }).catch(erro => {
        res.redirect('/admin/categories');
    })
});

router.post("/categories/update", adminAuth, (req, res) => {
    Category.update({
        title: req.body.title,
        slug: slugify(req.body.title)
    }, {
        where: {
            id: req.body.id
        }
    }).then(() => {
        res.redirect('/admin/categories');
    });
})

module.exports = router;
