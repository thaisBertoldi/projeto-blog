const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
    res.send('Rota artigo')
});

router.get('/admin/articles/new', (req, res) => {
    res.send('Criar novo artigo')
});

module.exports = router;