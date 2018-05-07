const port = 3000
const express = require('express')
const config = require('./config/config')
const database = require('./config/database.config')

let environment = process.env.NODE_ENV || 'development'
let app = express()

database(config[environment])
require('./config/express')(app, config[environment])
require('./config/routes')(app)
require('./config/passport')()

app.listen(port)
console.log(`Server listening on port ${port}...`)
