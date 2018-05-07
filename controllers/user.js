const User = require('../models/User')
const encryption = require('../utilities/encryption')

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
      userFormObj.error = error.message
      res.render('user/register', userFormObj)
    })
}
