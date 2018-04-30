module.exports = (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/html'})
  res.write('<h1>404 Page Not Found</h1>')
  res.end()
}
