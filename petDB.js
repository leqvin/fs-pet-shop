'use strict';
const express = require('express');
const app = express();
const db = require('./queries')
app.use(express.json()) // for parsing application/json




app.get('/pets?', db.getPets);
app.get('/pets/:id?', db.getPetById);
app.post('/pets?', db.createPet);
app.patch('/pets/:id?', db.updatePet);
app.delete('/pets/:id?', db.deletePet);

app.listen(8100, ()=>{
    console.log('server is running');
})