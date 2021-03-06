const handlers = require('../controllers/index')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', handlers.home.index)

  app.get('/product/add', auth.isAuthenticated, handlers.product.addGet)
  app.post('/product/add', auth.isAuthenticated, handlers.product.addPost)

  app.get('/category/add', auth.isAdmin, handlers.category.addGet)
  app.post('/category/add', auth.isAdmin, handlers.category.addPost)

  app.get('/category/:category/products', handlers.category.productByCategory)

  app.get('/product/edit/:id', auth.isAuthenticated, handlers.product.editGet)
  app.post('/product/edit/:id', auth.isAuthenticated, handlers.product.editPost)

  app.get('/product/delete/:id', auth.isAuthenticated, handlers.product.deleteGet)
  app.post('/product/delete/:id', auth.isAuthenticated, handlers.product.deletePost)

  app.get('/product/buy/:id', auth.isAuthenticated, handlers.product.buyGet)
  app.post('/product/buy/:id', auth.isAuthenticated, handlers.product.buyPost)

  app.get('/user/register', handlers.user.registerGet)
  app.post('/user/register', handlers.user.registerPost)

  app.get('/user/login', handlers.user.loginGet)
  app.post('/user/login', handlers.user.loginPost)

  app.post('/user/logout', auth.isAuthenticated, handlers.user.logout)

  app.get('/user/profile', auth.isAuthenticated, handlers.user.profileGet)
  app.get('/user/profile/edit', auth.isAuthenticated, handlers.user.profileEditGet)
  app.post('/user/profile/edit', auth.isAuthenticated, handlers.user.profileEditPost)

  app.get('/user/products/bought', auth.isAuthenticated, handlers.user.boughtProductsGet)

  app.all('*', handlers.error.error)
}
