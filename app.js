// Importing Packages
const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid'); 

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
console.log(userDatas)

// ROUT = HTTP METHOD + URL

// Get All members 
// app.get('/api/members', (req, res) => {
//     try {
//         res.json(members) 
//     } catch (error) {
//         console.log('Error1 : ', error)
//     }
// });

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

        // Generate a UUID for the user
        formData.id = uuidv4();

        fs.writeFileSync('./datas/users.json', JSON.stringify(userDatas, null, 2), 'utf-8');
        res.redirect('/form');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit
app.patch('/edit/:id', (req, res) => {
    try {
        const found = userDatas.filter(item => item.id === parseInt(req.params.id));

        if (found.length > 0) {
            const updDatas = req.body;

            userDatas.forEach(user => {
                if (user.id === parseInt(req.params.id)) {
                    user.name = updDatas.name ? updDatas.name : user.name;
                    user.age = updDatas.age ? updDatas.age : user.age;
                    res.json({ message: 'User updated successfully', user});
                }
            });

            
        } else {
            res.status(400).json(`No member with id of ${req.params.id}`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get Single members
// app.get('/api/members/:id', (req, res) => {
//     try {
//         const found = members.some(member => member.id === parseInt(req.params.id));
//         if (found) {
//             res.json(members.filter(member => member.id === parseInt(req.params.id)));    
//         } else {
//             res.status(400).send(`NO Member with Id of ${req.params.id}`)
//         }

//     } catch (error) {
//         console.log('Error2 : ', error)
//     }
// })

// Creating server
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))