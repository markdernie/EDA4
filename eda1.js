function printTime(message, arg1,arg2,prompt1,prompt2, verbose) {

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const dt = DateTime.local(2017, 5, 15, 8, 30);
    const now = DateTime.now();
    const format1 = "DATETIME_MED_WITH_SECONDS"
    const format2 = 'TIME_WITH_SECONDS'

    if (arg2&&arg1) {
        //console.log('arg2&&arg1')
        console.log('\t', message, '\t',prompt1, arg1, prompt2 ,arg2, '\tat:' + ':', now.millisecond)
    }
    else if (arg1) {
        //console.log('arg1')
        console.log('\t', message, '\t', arg1, '\tat:', now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS) + ':', now.millisecond)
    } else {
        //console.log('no args')
        console.log('\t', message, '\t', arg1, '\tat:', now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS) + ':', now.millisecond)
    }
}
function getArgs() {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {

            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}




var params = function (req) {

    let q = req.url.split('?'), result = {};

    if (q.length >= 2) {
        q[1].split('&').forEach((item) => {
            try {
                result[item.split('=')[0]] = item.split('=')[1];
            } catch (e) {
                result[item.split('=')[0]] = '';
            }
        })
    }

    return result;
}

var http = require('http');



const fs = require('fs');
const { url } = require('url');
const queryString = require('querystring');
const { DateTime } = require("luxon")

var Set = require("collections/set");
//const { MatTabBodyPortal } = require('@angular/material/tabs');


const dt = DateTime.local(2017, 5, 15, 8, 30);



const args = getArgs();
const verbose = args.v

printTime('start', '', verbose)



const dir = './data/';
const indexfile = dir + 'index.dat'

var port = args.port


if (!port) {
   
    port = 3002
    printTime('port set:', '3002', verbose)
}
var count = 0
const separator = '<<EVENT>>\r\n'
printTime('port', port, verbose)



http.createServer((req, res) => {
    //res.writeHead(200, { 'Access-Control-Allow-Origin': 'http://localhost:4200' });
    //res.writeHead(200, { 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT' });
    printTime('got a req.method:', req.method, verbose)

    var querystring = params(req)
    

    file = querystring.file
    if (!file) {
        printTime('EXITTING because of no file sent', '', verbose)

        return
    }

    path = './data/' + file

    count++
    
    printTime('method', req.method, verbose)
    
    if (req.method == "PUT") {
        printTime('PUT', '', verbose)
        

        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

       
        

        req.on('end', () => {

            const lastupdate = Date.now()

            printTime('lastupdate:',lastupdate,verbose)
            bodyd = body
            bodyp=JSON.parse(body)
            printTime('body:',body,verbose)
            //printTime('bodyp:',bodyp,verbose)

            bodyp.lastupdate=lastupdate
            printTime('bodyp.lastupdate:',bodyp.lastupdate,verbose)
            //bodyp.lastupdatestr=lastupdate
            //printTime('bodyd.lastupdatestr:',bodyd.lastupdatestr,verbose)
            //printTime('lud',bodyd,verbose)
            
            //JSON.parse(bodyd).n01=lastupdate
           // bodyd.n01='99999999999'
            //printTime('bodyd.n01',bodyd.n01)

            //printTime('lud.lud',bodyd.n01,verbose)
            bodys=JSON.stringify(bodyp)

            let bodyparsed = JSON.parse(bodyd)

            fs.appendFile(path, bodys + separator, function (err) {
                if (err) {

                    printTime('append FAILED:', path, verbose)
                } else {
                    printTime('PUT body Worked:', path, verbose)

                }
            })
            // added lastupdate field to index faled as it send back multiple e=records per id
            // when using Set to get unique records

           // let index = '{"id":"' + bodyparsed.id + '","lastupdate":' + lastupdate + '}'
            let index = '{"id":"' + bodyparsed.id  + '"}'
            fs.appendFile(indexfile, index + separator, function (err) {
                if (err) {
                    console.log("\tappend to index failed")
                } else {
                    console.log("\tPUT index Worked", indexfile)
                }
            })

            res.write(JSON.stringify({'message':'PUT SUCCESS'}))

            res.end();
        });
    }
    if (req.method === "GET" && querystring.action === 'index') {

        printTime('GET index', '', verbose)

        res.writeHead(200, { 'Content-Type': 'application/json' });

        if (querystring.action === 'index') {


            fs.readFile(indexfile, "utf8", function (err, data) {
                if (!data) {
                    console.log('data empty')
                    printTime('index is empty', '', verbose)


                } else {


                    let array = data.toString().split('<<EVENT>>\r\n')
                        .filter((val) => { return val });


                    let arrayjson = JSON.stringify(array)



                    res.write(arrayjson)
                    
                    for (const element of array) {
                        console.log('LOOPING:', element)
                        let jelement = JSON.parse(element)
                        console.log('jelement:', jelement)
                        console.log('jelement.id:', jelement.id)

                    }
                    res.write(JSON.stringify({'message':'GET index SUCCESS'}))

                    res.end();

                }

            })


        }

    }
    if (req.method === "GET" && querystring.action === 'all') {
        printTime('get all', req.method,querystring,'method:','querystring:',verbose)
        
                
        fs.readFile(indexfile, "utf8", function (err, data) {
            printTime('fs.readfile outer', indexfile,data,'readfile:','data:',verbose)
            if (!data) {
                console.log('data empty')
                printTime('index is empty', '', verbose)
            } else {
                
                let alllines = data.toString().split('<<EVENT>>\r\n')
                    .filter((val) => { return val });
                let uniquelines= [...new Set(alllines)]
                
                let returnval=[]
                
                for (const element of uniquelines) {

                    
                    
                    let jelement = JSON.parse(element)
                    
                    returnval.push(jelement)
                    
                    
                    
                    
                }
                res.write(JSON.stringify(returnval))
                            
                res.end();

                

            }

        })
    }


    if (req.method === "GET" && querystring.action === 'cv') {
        if (querystring.action === 'cv') {

            printTime('action=cv ', querystring.action, verbose)

            printTime('file', file, verbose)
            //"utf8" is the encoding of the file so you get a string rather than a buffer(see stack overflow in Work/Technology/Filesystem)
            //if(false){
            fs.readFile('./data/' + file, "utf8", function (err, data) {
                if (!data) {
                    printTime('Data is empty', '', verbose)
                    res.write(JSON.stringify({ 'ERROR': 'the file:' + file + ' does not exists' }))
                    res.end();

                } else {
                    printTime('data:',JSON.stringify(data))
                    //ppdata=JSON.parse(data)
                    //printTime('ppdata:',ppdata)
                    //if(false){
                        let go0 = data.toString().split('<<EVENT>>\r\n');
                        let go1 = go0.reduce((accumulor, item) => {
                            if (item) {
                                accumulor = JSON.parse(item)

                            }
                            return accumulor
                        }, {})
                        res.write(JSON.stringify(go1))
                        res.end();
                    //}                
                }

            })
        
        }
    }
    printTime('end -------', '', verbose)

}).listen(port);
