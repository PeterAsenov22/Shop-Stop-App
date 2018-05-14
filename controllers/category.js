const Category = require('../models/Category')
const User = require('../models/User')
const errorHandler = require('../utilities/error-handler')

module.exports.addGet = (req, res) => {
  res.render('category/add')
}

module.exports.addPost = (req, res) => {
  let categoryFormObj = req.body
  let category = {
    name: categoryFormObj.name,
    creator: req.user.id
  }

  Category.create(category).then(category => {
    User.findById(req.user.id).then(user => {
      user.createdCategories.push(category.id)
      user.save()

      res.redirect('/')
    })
  })
    .catch(error => {
      categoryFormObj.error = errorHandler.handleMongooseError(error)
      res.render('category/add', categoryFormObj)
    })
}

module.exports.productByCategory = (req, res) => {
  let categoryName = req.params.category

  Category
    .findOne({name: categoryName})
    .populate('products')
    .then(category => {
      if (!category) {
        res.sendStatus(404)
        return
      }

      res.render('category/all-by-category', {
        name: category.name,
        products: category
          .products
          .filter(p => !p.buyer)
          .sort((a, b) => { return b.createdOn - a.createdOn })
      })
    })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`${categoryName} category was not found!`)}`)
    })
}
