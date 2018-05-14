const User = require('../models/User')
const Product = require('../models/Product')
const encryption = require('../utilities/encryption')
const errorHandler = require('../utilities/error-handler')
const fs = require('fs')

module.exports.registerGet = (req, res) => {
  res.render('user/register')
}

module.exports.registerPost = (req, res) => {
  let userFormObj = req.body
  let user = {}

  if (!userFormObj.password || userFormObj.password !== userFormObj.confirmedPassword) {
    userFormObj.error = 'Passwords do not match.'
    res.render('user/register', userFormObj)
    return
  }

  user.username = userFormObj.username
  user.firstName = userFormObj.firstName
  user.lastName = userFormObj.lastName
  user.age = userFormObj.age
  user.email = userFormObj.email
  user.gender = userFormObj.gender
  user.salt = encryption.generateSalt()
  user.password = encryption.generateHashedPassword(user.salt, userFormObj.password)

  User.create(user)
    .then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.render('user/register', {error: 'Authentication not working!'})
          return
        }

        res.redirect('/')
      })
    })
    .catch(error => {
      userFormObj.error = errorHandler.handleMongooseError(error)
      res.render('user/register', userFormObj)
    })
}

module.exports.loginGet = (req, res) => {
  res.render('user/login')
}

module.exports.loginPost = (req, res) => {
  let userToLogin = req.body

  User.findOne({username: userToLogin.username})
    .then(user => {
      if (!user || !user.authenticate(userToLogin.password)) {
        res.render('user/login', {error: 'Invalid credentials.'})
        return
      }

      req.login(user, (err, user) => {
        if (err) {
          res.render('user/login', {error: 'Authentication not working!'})
          return
        }

        res.redirect('/')
      })
    })
    .catch(() => {
      res.render('user/login', {error: 'Invalid credentials.'})
    })
}

module.exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

module.exports.profileGet = (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.render('user/profile', user)
    })
    .catch(() => {
      res.redirect('/')
    })
}

module.exports.profileEditGet = (req, res) => {
  res.render('user/edit', {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    age: req.user.age,
    email: req.user.email,
    profileImage: req.user.image,
    isMale: req.user.gender === 'Male'
  })
}

module.exports.profileEditPost = (req, res) => {
  let newInfo = req.body

  User
    .findById(req.user.id)
    .then(user => {
      user.firstName = newInfo.firstName
      user.lastName = newInfo.lastName
      user.age = newInfo.age
      user.email = newInfo.email
      user.gender = newInfo.gender

      if (req.files.image) {
        let oldPath = user.image
        let userImage = req.files.image
        let path = `/images/profilePictures/${userImage.name}`
        user.image = path

        user
          .save()
          .then(() => {
            userImage.mv(`./content${path}`, (err) => {
              if (err) {
                console.log(err)
                return
              }

              if (oldPath) {
                fs.unlinkSync(`./content${oldPath}`)
              }

              res.redirect('/user/profile/?success="Suceess"')
            })
          })
          .catch((err) => {
            console.log(err)
            res.redirect('/user/profile/?error="Error"')
          })
      } else {
        user
          .save()
          .then(() => {
            res.redirect('/user/profile/?success="Suceess"')
          })
          .catch((err) => {
            console.log(err)
            res.redirect('/user/profile/?error="Error"')
          })
      }
    })
}

module.exports.boughtProductsGet = (req, res) => {
  Product
    .find({buyer: req.user.id})
    .sort('-boughtOn')
    .then(products => {
      res.render('user/products', { products })
    })
}
