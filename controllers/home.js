const Product = require('../models/Product')

module.exports.index = (req, res) => {
  let queryData = req.query

  Product.find({buyer: null}).populate('category').then((products) => {
    if (queryData.query) {
      products = products.filter(p => p.name.toString().toLowerCase().startsWith(queryData.query.toLowerCase()))
    }

    products.forEach(function (p) { p.home = true })
    let data = {products}

    if (queryData.error) {
      data.error = queryData.error
    } else if (queryData.success) {
      data.success = queryData.success
    }

    res.render('home/index', data)
  })
}
