const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', { users: users });
    });
});

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create');
});

router.post('/users/create', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/admin/users');
            }).catch((err) => {
                res.redirect('/admin/users');
            });
        } else {
            res.redirect('/admin/users/create');
        }
    })
});

router.post('/users/delete', (req, res) => {
    const id = req.body.id;
    if(id !== undefined && !isNaN(id)) {
        User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/users');
        })
    } else {
        res.redirect('/admin/users');
    }
});

router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect('/admin/articles');
        } else {
            res.redirect('/login');
        }
    })
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

module.exports = router;