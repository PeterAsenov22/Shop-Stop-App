const fs = require('fs')
const path = require('path')

let typeChecker = path => {
  let support = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.ico': 'image/x-icon'
  }

  for (let type in support) {
    if (path.endsWith(type)) {
      return support[type]
    }
  }

  return 'text/plain'
}

module.exports = (req, res) => {
  let type = typeChecker(req.pathname)

  if (req.pathname.startsWith('/content/') && req.method === 'GET') {
    let filepath = path.normalize(
      path.join(__dirname, `..${req.pathname}`))

    fs.readFile(filepath, (err, data) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/html'
        })
        res.write('<h1>Resource not found!</h1>')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': type
      })
      res.write(data)
      res.end()
    })
  } else {
    return true
  }
}
