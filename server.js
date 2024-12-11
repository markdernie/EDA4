

const http = require('http')
const hostname = '127.0.01'
const port = 8080

http
    .get('http://api.open-notify.org/astros.json', resp => {
        let data = ''
        resp.on('data', chunk => {
            data += chunk
        })
        resp.on('end', () => {
            let peopleData = JSON.parse(data)
            console.log(peopleData)
        })
        
    })
    .on('error', err => {
        console.log("Error: ", err.message)
    })
