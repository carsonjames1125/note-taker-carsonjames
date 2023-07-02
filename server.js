// server for the backend of the application
// need dependencies, routes, a port, and parsing of incoming data
// also need a link to the db.json for saving the notes in the application

const express = require('express');

const fs = require('fs');

//need a path var
const path = require('path');

const notesJS = require('./db/db.json');

// want unique ids for the notes
const { v4 : uuidv4 } = require('uuid')
const id = uuidv4();

// PORT

const PORT = 3001;

// create app 

const app = express();

app.use(express.json());
app.use(express.static('public'));

// need a get route for the main page section

app.get('/', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// get for the notes page

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// now that they have been joined i need a get request for the notes.html 

app.get('/api/notes', (req, res) => {
    // send the file
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
    console.info(`${req.method} request for notes recieved. SUCCESS!`);
});

//POST for the notes

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} note will be added`)
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title, 
            text,
            id: id,
        }
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const pNotes = JSON.parse(data);
            pNotes.push(newNote)
            fs.writeFile('./db/db.json', JSON.stringify(pNotes, null, 4), (err) => {
                err ? console.log(err) : console.log('Note added. SUCCESS!')
            })
        }
    })

    const result = {
        status: 'success',
        body: newNote
    }

    console.log(result);
    res.json(result);
    } else  {
        res.json("Error posting note.")
    }
});

// delete request for later

// wildcard 
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);
// connection

app.listen(PORT, () => {
    console.log(`Success, application running on port ${PORT}`);
})


