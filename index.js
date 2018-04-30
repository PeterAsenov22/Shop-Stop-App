const http = require('http')
const url = require('url')
const port = 3000
const handlers = require('./handlers/index')

let environment = process.env.NODE_ENV || 'development'
const config = require('./config/config')
const database = require('./config/database.config')

database(config[environment])

http.createServer((req, res) => {
  req.pathname = url.parse(req.url).pathname
  for (const handler of handlers) {
    let result = handler(req, res)
    if (!result) {
      break
    }
  }
}).listen(port)

console.log(`Server listening on port ${port}...`)
