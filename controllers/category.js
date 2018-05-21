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
  let queryData = req.query
  let page = parseInt(queryData.page) || 1
  let pageSize = 3

  Category
    .findOne({name: categoryName})
    .populate('products')
    .then(category => {
      if (!category) {
        res.sendStatus(404)
        return
      }

      console.log(category)
      console.log(page)

      let products = category
        .products
        .filter(p => !p.buyer)
        .sort((a, b) => { return b.createdOn - a.createdOn })
        .slice((page - 1) * pageSize)
        .slice(0, pageSize)

      console.log(products)

      res.render('category/all-by-category', {
        name: category.name,
        products: products,
        hasPrevPage: page > 1,
        hasNextPage: products.length > 0,
        nextPage: page + 1,
        prevPage: page - 1,
        pageUrl: `/category/${categoryName}/products`
      })
    })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`${categoryName} category was not found!`)}`)
    })
}
