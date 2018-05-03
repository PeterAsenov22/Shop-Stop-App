const homeHandler = require('./home')
const productHandler = require('./product')
const categoryHandler = require('./category')
const errorHandler = require('./error')

module.exports = {
  home: homeHandler,
  product: productHandler,
  category: categoryHandler,
  error: errorHandler
}
