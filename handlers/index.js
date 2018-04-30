const homeHandler = require('./home')
const filesHandler = require('./static-files')
const productHandler = require('./product')
const errorHandler = require('./error')

module.exports = [homeHandler, productHandler, filesHandler, errorHandler]
