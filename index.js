const http = require('http')
const port = 3000
const handlers = require('./handlers/index')

http.createServer((req, res) => {
  for (const handler of handlers) {
    let result = handler(req, res)
    if (!result) {
      break
    }
  }
}).listen(port)

console.log(`Server listening on port ${port}...`)
