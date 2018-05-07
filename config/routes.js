const handlers = require('../controllers/index')
const multer = require('multer')
let upload = multer({dest: './content/images'})

module.exports = (app) => {
  app.get('/', handlers.home.index)

  app.get('/product/add', handlers.product.addGet)
  app.post('/product/add', upload.single('image'), handlers.product.addPost)

  app.get('/category/add', handlers.category.addGet)
  app.post('/category/add', handlers.category.addPost)

  app.get('/category/:category/products', handlers.category.productByCategory)

  app.get('/product/edit/:id', handlers.product.editGet)
  app.post('/product/edit/:id', upload.single('image'), handlers.product.editPost)

  app.get('/product/delete/:id', handlers.product.deleteGet)
  app.post('/product/delete/:id', handlers.product.deletePost)

  app.get('/product/buy/:id', handlers.product.buyGet)

  app.get('/user/register', handlers.user.registerGet)
  app.post('/user/register', handlers.user.registerPost)

  app.get('/user/login', handlers.user.loginGet)
  app.post('/user/login', handlers.user.loginPost)

  app.post('/user/logout', handlers.user.logout)

  app.all('*', handlers.error.error)
}
