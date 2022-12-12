const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
    res.send('Rota categorias')
});

router.get('/admin/categories/new', (req, res) => {
    res.send('Criar nova categoria')
});

module.exports = router;
