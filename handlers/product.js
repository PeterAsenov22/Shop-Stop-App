const Product = require('../models/Product')
const Category = require('../models/Category')

module.exports.addGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('products/add', {
      categories
    })
  })
}

module.exports.addPost = (req, res) => {
  let productObj = req.body
  productObj.image = '\\' + req.file.path

  Product.create(productObj).then(product => {
    Category.findById(product.category).then(category => {
      category.products.push(product.id)
      category.save()

      res.redirect('/')
    })
  })
}
