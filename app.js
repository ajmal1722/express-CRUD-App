// Importing Packages
const express = require('express');
const fs = require('fs');
const path = require('path');


// inbuild modules
const members = require('./datas/members.js');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 5000;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Reading Files
const indexPath = fs.readFileSync('./templates/index.ejs', 'utf-8');

// ROUT = HTTP METHOD + URL

// Get All members
app.get('/api/members', (req, res) => {
    try {
        res.json(members) 
    } catch (error) {
        console.log('Error1 : ', error)
    }
});

// Get Single members
app.get('/api/members/:id', (req, res) => {
    try {
        const found = members.some(member => member.id === parseInt(req.params.id));
        if (found) {
            res.json(members.filter(member => member.id === parseInt(req.params.id)));    
        } else {
            res.status(400).send(`NO Member with Id of ${req.params.id}`)
        }

    } catch (error) {
        console.log('Error2 : ', error)
    }
})

// Creating server
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))