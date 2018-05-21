const Product = require('../models/Product')

module.exports.index = (req, res) => {
  let queryData = req.query
  let page = parseInt(queryData.page) || 1
  let pageSize = 3

  Product
    .find({buyer: null})
    .sort('-createdOn')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('category')
    .then((products) => {
      if (queryData.query) {
        products = products.filter(p => p.name.toString().toLowerCase().startsWith(queryData.query.toLowerCase()))
      }

      products.forEach(function (p) { p.home = true })
      let info = {}

      if (queryData.error) {
        info.error = queryData.error
      } else if (queryData.success) {
        info.success = queryData.success
      }

      res.render('home/index', {
        error: info.error,
        success: info.success,
        products: products,
        hasPrevPage: page > 1,
        hasNextPage: products.length > 0,
        nextPage: page + 1,
        prevPage: page - 1,
        pageUrl: '/'
      })
    })
}
