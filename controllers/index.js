const userHandler = require('./user')
const homeHandler = require('./home')
const productHandler = require('./product')
const categoryHandler = require('./category')
const errorHandler = require('./error')

module.exports = {
  user: userHandler,
  home: homeHandler,
  product: productHandler,
  category: categoryHandler,
  error: errorHandler
}
