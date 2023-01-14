const express = require("express");
const app = express();
const connection = require("./database/database");
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./user/UsersController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./user/User');
const session = require('express-session');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita");
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.use(session({
  secret: 'techuptogetherprodigydigitalbusiness',
  cookie: { maxAge: 30000 }
}))

app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles: articles, categories: categories });
    });
  })
});

app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article !== undefined) {
      Category.findAll().then(categories => {
        res.render('article', { article: article, categories: categories });
      });
    } else {
      res.redirect('/');
    }
  }).catch(err => {
    res.redirect('/');
  });
})

app.get('/category/:slug', (req, res) => {
  Category.findOne({
    where: {
      slug: req.params.slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if (category !== undefined) {
      Category.findAll().then(categories => {
        res.render('index', { articles: category.articles, categories: categories })
      });
    } else {
      res.redirect('/');
    }
  }).catch(err => {
    res.redirect('/');
  })
})

app.listen(8181, () => {
  console.log("Servidor rodando...");
});
