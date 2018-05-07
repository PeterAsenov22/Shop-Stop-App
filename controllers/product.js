const fs = require('fs')
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

module.exports.editGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).populate('category').then(product => {
    if (!product) {
      res.sendStatus(404)
    }

    Category.find().then((categories) => {
      categories.forEach(c => { c.selected = (c.id === product.category.id) })
      res.render('products/edit', {
        categories,
        product
      })
    })
  })
}

module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedProduct = req.body

  Product.findById(id).populate('category').then(product => {
    if (!product) {
      res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
      return
    }

    product.name = editedProduct.name
    product.description = editedProduct.description
    product.price = editedProduct.price

    if (req.file) {
      product.image = '\\' + req.file.path
    }

    if (product.category.toString() !== editedProduct.category) {
      Category.findById(product.category).then(currentCategory => {
        Category.findById(editedProduct.category).then(newCategory => {
          let index = currentCategory.products.indexOf(product.id)
          if (index >= 0) {
            currentCategory.products.splice(index, 1)
          }

          currentCategory.save()

          newCategory.products.push(product.id)
          newCategory.save()

          product.category = editedProduct.category
          product.save().then(() => {
            res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`)
          })
        })
      })
    } else {
      product.save().then(() => {
        res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`)
      })
    }
  })
}

module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).select('name description image').then(product => {
    if (!product) {
      res.sendStatus(404)
    }

    res.render('products/delete', {
      product
    })
  })
}

module.exports.deletePost = (req, res) => {
  let id = req.params.id

  Product.findById(id).then(product => {
    if (!product) {
      res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
      return
    }

    fs.unlink('.' + product.image, (err) => {
      if (err) {
        console.log(err)
      }

      Category.findById(product.category).then(category => {
        let index = category.products.indexOf(product.id)
        if (index >= 0) {
          category.products.splice(index, 1)
        }

        category.save()
        product.remove().then(() => {
          res.redirect(`/?success=${encodeURIComponent('Product was removed successfully!')}`)
        })
      })
    })
  })
}

module.exports.buyGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).select('name description image price').then(product => {
    if (!product) {
      res.sendStatus(404)
    }

    res.render('products/buy', {
      product
    })
  })
}
