// Importing Packages
const express = require('express');
const app = express()

// ROUT = HTTP METHOD + URL
app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})
// Creating server
const port = 3000;
app.listen(port, () => {
    console.log('server has created..')
})