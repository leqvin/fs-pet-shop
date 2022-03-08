'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const express = require('express');
const res = require('express/lib/response');
const app = express();

app.use(express.json()) // for parsing application/json


function readPetsFile(callback){
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) callback(err);
        else {
            callback(null, JSON.parse(petsJSON))
        }
      });
}

app.route('/pets/:petIndex?')
.get((req,res) => {
    const petIndex = Number(req.params.petIndex)
    readPetsFile((err, petsJSON) => {
        if (err) {
            serverErrorHandler (err, res);
        } else {
            if (isNaN(petIndex)){
                res.json(petsJSON);
            } 
            else if (petIndex >= 0 && petIndex < petsJSON.length){
                res.json(petsJSON[petIndex])
            }        
            else {
                notFoundErrorHandler(req, res);
            }
        }  
    })
})
.post((req,res) => {
    const petIndex = Number(req.params.petIndex)
    readPetsFile((err, petsJSON) => {
        if (err) {
            serverErrorHandler (err, res);
        } else {
            const requiredKeys = ['age', 'kind', 'name'];
            let ageIntBool = typeof(req.body.age) === "number"
            let keysPresentBool = requiredKeys.every(key => Object.keys(req.body).includes(key))
            if(isNaN(petIndex) && ageIntBool && keysPresentBool){
                let newPet = {};
                newPet.age = req.body.age;
                newPet.kind = req.body.kind;
                newPet.name = req.body.name;
                petsJSON.push(newPet);
                let petsJSONstr = JSON.stringify(petsJSON);

                try {
                    fs.writeFileSync(petsPath, petsJSONstr)
                } catch (err) {
                    console.error(err)
                    serverErrorHandler (err, res)
                }
                res.send("Pet Added")
            } else {
                res.status(400).send('Bad Request');
            }
        }     
    })
})


function notFoundErrorHandler (req, res) {
    res.status(404).header('Content-Type', 'text/plain').send("Not Found")
  }

function serverErrorHandler (err, res) {
    console.error(err.stack);
    res.status(500).header('Content-Type', 'text/plain').send('Internal Server Error')
  }

app.listen(8000, ()=>{
    console.log('server is running');
})

module.exports = app

