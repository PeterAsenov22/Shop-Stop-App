const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app, config) => {
  app.engine('handlebars', exphbs({defaultLayout: 'main'}))
  app.set('view engine', 'handlebars')

  app.use(bodyParser.urlencoded({extended: true}))
  app.use(cookieParser())
  app.use(session({secret: 'S3cr3t', saveUninitialized: false, resave: false}))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.url.startsWith('/content')) {
      req.url = req.url.replace('/content', '')
    }

    next()
  }, express.static(path.normalize(path.join(config.rootPath, 'content'))))
}
