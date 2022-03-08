'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var http = require('http');
var port = process.env.PORT || 8000;

const petRegExp = /^\/pets\/(\d+)$/;

function readPetsFile(callback){
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) callback(err);
        callback(null, JSON.parse(petsJSON))
      });
}

var server = http.createServer(function(req, res) {
  if (req.method === "GET" && petRegExp.test(req.url)){
      const index = req.url.match(petRegExp)[1]
      fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
          console.error(err.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Internal Server Error');
        } else{
            var pets = JSON.parse(petsJSON);
            var petsJSONstr = JSON.stringify(pets[index]);
            if(index < 0 || index > pets.length-1){
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.write(petsJSONstr)
                res.end();
            }  
        }
      });
  }  
  else if (req.method === 'GET' && /^\/pets\/?$/.test(req.url)) {
    readPetsFile((err, petsJSON) => {
        if (err) {
            console.error(err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Error Reading File');
        } else{
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(petsJSON))
            res.end();
        }  
    })
    // fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    //   if (err) {
    //     console.error(err.stack);
    //     res.statusCode = 500;
    //     res.setHeader('Content-Type', 'text/plain');
    //     return res.end('Error Reading File');
    //   } else{
    //     res.setHeader('Content-Type', 'application/json');
    //     res.write(petsJSON)
    //     res.end();
    //   }
    // });
  }   

  else if (req.method === 'POST' && req.url === '/pets') {
    let body = "";
    req.on('data', function (chunk) {
        body += chunk;
      });
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Error Reading File');
      } else {
        const neededKeys = ['age', 'kind', 'name'];
        let pets = JSON.parse(petsJSON);
        let bodyJSON = JSON.parse(body)

        if(typeof(bodyJSON.age) === "number" && neededKeys.every(key => Object.keys(bodyJSON).includes(key))){
            let newPet = {}
            newPet.age = bodyJSON.age;
            newPet.kind = bodyJSON.kind;
            newPet.name = bodyJSON.name;
            pets.push(newPet);

            let petsJSONstr = JSON.stringify(pets);
            
            try {
                fs.writeFileSync(petsPath, petsJSONstr)
            } catch (err) {
            console.error(err)
            }
            res.setHeader('Content-Type', 'application/json');
            res.write("Pet Added")
            res.end();
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.write('Bad Request')
            res.end();
        }
      }
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Not Found')
    res.end();
  }
});

server.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = server


