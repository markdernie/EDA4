const http = require('http');
const fs = require('fs');
const port = 8080;

console.log('port:',port)

http.createServer((req, res) => {
  const headers = {
    //'Access-Control-Allow-Origin': 'http://localhost:4200', /* @dev First, read about security */
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
   //'Access-Control-Allow-Methods': 'GET',
   'Content-Type': 'application/json',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };
  console.log('req.method',req.method)
  console.log('req.origin',req.origin)

  if (req.method === 'OPTIONS') {
    console.log('this is an Options request')
    res.writeHead(204, headers);
    res.end();
    return;
  }
  console.log('sending header',headers)
  res.writeHead(204, headers);
  let file='file1.dat'
 


  if (['GET', 'POST'].indexOf(req.method) > -1) {
    console.log('file:',file)
    fs.readFile('./jsonfiles/' + file, "utf8", function (err, data) {
        
       console.log('here:',data.length)
       res.write(JSON.stringify(data))
       
    res.end();
    return;
    });
    //console.log('in get2')
    //res.writeHead(200, headers);
    //res.end(data);
    //return;
  }

  //res.writeHead(405, headers);
 // res.end(`${req.method} is not allowed for the request.`);
}).listen(port);