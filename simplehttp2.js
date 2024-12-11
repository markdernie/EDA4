const http = require('http');
const fs = require('fs');
const hostname = '127.0.01'
const port = 8000;

console.log('port:', port)
http.createServer((req, res) => {
  req.on('end', () => {
    let peopleData = JSON.parse(data)

    const server = http.createServer((req, res) => {
      res.statusCode = 200

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(stuff.people))
    })
    server.listen(port) //, hostname, () => {
      //console.log(`Server running at http://${hostname}:${port}/`)
    //})
    // server.listen(port, hostname, () => {
    //   console.log(`Server running at http://${hostname}:${port}/`)
    // })
  })
})


