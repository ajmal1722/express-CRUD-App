// Importing Packages
const express = require('express');
const fs = require('fs');
const path = require('path'); 
const ejs = require('ejs'); 

const app = express();
const PORT = process.env.PORT || 5000;

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Reading Files
const indexPath = fs.readFileSync('./templates/index.ejs', 'utf-8');
const formPage = fs.readFileSync('./form.html', 'utf-8');
const jsonData = fs.readFileSync('./datas/users.json', 'utf-8');
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');


let userDatas = JSON.parse(jsonData);

// Home page
app.get('/', (req, res) => {
    res.status(200).render('index', { userDatas });
});

// Form page
app.get('/form', (req, res) => {
    res.status(200).send(formPage);
}) 

// Submit
app.post('/submit', (req, res) => {
    try {
        const formData = req.body
        userDatas.push(formData);

        formData.id = userDatas.length;

        fs.writeFileSync('./datas/users.json', JSON.stringify(userDatas, null, 2), 'utf-8');
        res.redirect('/form');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit
app.get('/edit/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        const userToEdit = userDatas.find(user => parseInt(user.id) === userId);

        if (!userToEdit){
            return res.status(404).send(`User not found with the ID of ${userId}`);
        }
        res.render('edit', { userToEdit });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
});

// Update
app.post('/update/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const originalId = req.body.id;  // here .id is the name of input field of ID in edit.ejs

        if (userId !== originalId) {
            return res.status(400).send('invalid request')
        }

        const formData = req.body;
        const userIndex = userDatas.findIndex(user => parseInt(user.id) === parseInt(userId));

        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }

        userDatas[userIndex] = formData;
        fs.writeFileSync('./datas/users.json', JSON.stringify(userDatas, null, 2), 'utf-8');

        console.log('Data successfully updated in users.json:', userDatas);

        res.redirect('/');
    } catch (error) {
        console.log('Error message : ', error);
       
    }
});

// Delete
app.get('/delete/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const index = userDatas.findIndex(user => parseInt(user.id) === userId);
        
        if (index !== -1){
            userDatas.splice(index, 1);
            for (let i = index; i < userDatas.length; i++) {
                userDatas[i].id--;
            }
            fs.writeFileSync('./datas/users.json', JSON.stringify(userDatas, null, 2), 'utf-8');
            res.status(200).redirect('/')
        }
    } catch (error) {
        console.log('Error Message : ', error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Creating server
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))