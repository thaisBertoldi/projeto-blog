const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render('admin/articles/index', { articles: articles });
    })
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new-article', { categories: categories })
    })
});

router.post('/articles/save', adminAuth, (req, res) => {
    Article.create({
        title: req.body.title,
        slug: slugify(req.body.title),
        body: req.body.body,
        categoryId: req.body.category
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/delete', adminAuth, (req, res) => {
    const id = req.body.id;
    if(id !== undefined && !isNaN(id)) {
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        })
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    Article.findByPk(req.params.id)
    .then(article => {
        if(article !== undefined && !isNaN(req.params.id)) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article: article, categories: categories });
            });
        } else {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    })
});

router.post("/articles/update", adminAuth, (req, res) => {
    Article.update({
        title: req.body.title,
        slug: slugify(req.body.title),
        body: req.params.body,
        categoryId: req.body.category
    }, {
        where: {
            id: req.body.id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num;
    let offset = 0;
    
    if (!isNaN(page) || page !== 1) {
        offset = parseInt(page) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ],
    }).then(articles => {
        const next = offset + 4 < articles.count;
        const result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories => {
            res.render('admin/articles/page', { result: result, categories: categories })
        });
    })
});

module.exports = router;