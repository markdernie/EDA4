var express = require('express');
var cors = require('cors');
var app = express();
/*app.use(cors()); */
/* your regular routes go here */

var allowedOrigins = ['http://localhost:3000',
    'http://yourapp.com'];

    app.use(cors({
        origin: function(origin, callback){
          // allow requests with no origin 
          // (like mobile apps or curl requests)
          if(!origin) return callback(null, true);
          if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        }
      }));