const fs = require('fs')
const Product = require('../models/Product')
const Category = require('../models/Category')
const User = require('../models/User')
const errorHandler = require('../utilities/error-handler')

module.exports.addGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('products/add', {
      categories
    })
  })
}

module.exports.addPost = (req, res) => {
  let productObj = req.body

  let product = {
    name: productObj.name,
    description: productObj.description,
    price: productObj.price,
    category: productObj.category
  }

  if (req.files.image) {
    let productImage = req.files.image

    let path = `/images/${productImage.name}`

    product.image = path
    product.creator = req.user.id

    Product.create(product).then(product => {
      Category.findById(product.category).then(category => {
        category.products.push(product.id)
        category.save()

        User.findById(req.user.id).then(user => {
          user.createdProducts.push(product.id)
          user.save()

          productImage.mv(`./content${path}`, (err) => {
            if (err) {
              console.log(err)
              return
            }

            res.redirect('/')
          })
        })
      })
    }).catch(err => {
      Category.find().then((categories) => {
        productObj.error = errorHandler.handleMongooseError(err)
        productObj.categories = categories
        res.render('products/add', productObj)
      })
    })
  } else {
    Category.find().then((categories) => {
      productObj.error = 'Image is required.'
      productObj.categories = categories
      res.render('products/add', productObj)
    })
  }
}

module.exports.editGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).populate('category').then(product => {
    if ((product.creator.equals(req.user.id) || req.user.roles.indexOf('Admin') >= 0) && !product.buyer) {
      Category.find().then((categories) => {
        categories.forEach(c => { c.selected = (c.id === product.category.id) })
        res.render('products/edit', {
          categories,
          product
        })
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You are not allowed to edit this product!')}`)
    }
  })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`Product with Id ${id} was not found!`)}`)
    })
}

module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedProduct = req.body

  Product.findById(id).populate('category').then(product => {
    if ((product.creator.equals(req.user.id) || req.user.roles.indexOf('Admin') >= 0) && !product.buyer) {
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
    } else {
      res.redirect(`/?error=${encodeURIComponent('You are not allowed to edit this product!')}`)
    }
  })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`Product with Id ${id} was not found!`)}`)
    })
}

module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if ((product.creator.equals(req.user.id) || req.user.roles.indexOf('Admin') >= 0) && !product.buyer) {
      res.render('products/delete', {
        product
      })
    } else {
      res.redirect(`/?error=${encodeURIComponent('You are not allowed to delete this product!')}`)
    }
  })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`Product with Id ${id} was not found!`)}`)
    })
}

module.exports.deletePost = (req, res) => {
  let id = req.params.id

  Product.findById(id).then(product => {
    if ((product.creator.equals(req.user.id) || req.user.roles.indexOf('Admin') >= 0) && !product.buyer) {
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
    } else {
      res.redirect(`/?error=${encodeURIComponent('You are not allowed to delete this product!')}`)
    }
  })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`Product with Id ${id} was not found!`)}`)
    })
}

module.exports.buyGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).select('name description image price').then(product => {
    res.render('products/buy', {
      product
    })
  })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`Product with Id ${id} was not found!`)}`)
    })
}

module.exports.buyPost = (req, res) => {
  let productId = req.params.id

  Product.findById(productId).then(product => {
    if (product.buyer) {
      let error = `error=${encodeURIComponent('Product was already bought!')}`
      res.redirect(`/${error}`)
      return
    }

    product.buyer = req.user.id
    product.save().then(() => {
      req.user.boughtProducts.push(productId)
      req.user.save().then(() => {
        res.redirect('/')
      })
    })
  })
    .catch(() => {
      res.redirect(`/?error=${encodeURIComponent(`Product with Id ${productId} was not found!`)}`)
    })
}
