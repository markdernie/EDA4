const http = require('http');
const fs = require('fs');
const { hostname } = require('os');
const port = 8003;
const host = 'KatesLaptop'

console.log('port:',port)

http.createServer((req, res) => {
  console.log('req.method',req.method)
  req.on('end', () => {

    let peopleData = JSON.parse(data)

    const server = http.createServer((req, res) => {
      res.statusCode = 200

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(stuff.people))
    })
  })
  
  
 
}).listen(port,host, () => {
  console.log(`Server running at http://${host}:${port}/`)
});