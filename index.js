const express = require("express");
const app = express();
const connection = require("./database/database");
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');

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

app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
    res.render('index', { articles: articles });
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
      res.render('article', { article: article });
    } else {
      res.redirect('/');
    }
  }).catch(err => {
    res.redirect('/');
  });
})

app.listen(8181, () => {
  console.log("Servidor rodando...");
});
