// server for the backend of the application
// need dependencies, routes, a port, and parsing of incoming data
// also need a link to the db.json for saving the notes in the application

const express = require('express');

const fs = require('fs');

//need a path var
const path = require('path');

// want unique ids for the notes, downloaded uuid through npm to give the notes ids in the json file
const { v4 : uuidv4 } = require('uuid')

// const allows me to use id for shorthand 
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
// allows the results of the request to be labeled so tracking errors and when they occured is simple 
    const result = {
        status: 'success',
        body: newNote
    }
// console logs the responses if any issue occurs an error will show
    console.log(result);
    res.json(result);
    } else  {
        res.json("Error posting note.")
    }
});


// delete request for later
// app.delete and use the unique id to target a specific note that i want to delete and link those together with the delete button already visible in the html
app.delete('/api/notes/:id', (req, res) => {
    //give notice in the console that a note wishes to be deleted
    console.log(`${req.method} A note needs to be deleted.`)
    const noteID = req.params.id;
    // reads the db.json file, parses the data and filters out what need to be deleted by the uuid set for the note
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const pNotes = JSON.parse(data);
        const noteUpdate = pNotes.filter((note) => note.id !== id);

    // db.json file needs to be rewritten after a deletion with the updated data
    fs.writeFile('./db/db.json', JSON.stringify(noteUpdate, null, 4), (err) => {
        err ? console.log(err) : console.log('Note deleted')
    }) // console logs the success or failure of the deletion and notates which note was deleted by using the unique id 
    res.json(`${noteID} deleted`);
    })
})
// 
// 

// wildcard route 
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// connection letting me know that when i start the application that the port and app are running successfully. 
app.listen(PORT, () => {
    console.log(`Success, application running on port ${PORT}`);
})


