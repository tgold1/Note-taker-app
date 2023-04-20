const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json')
const generateUniqueId = require('generate-unique-id');

const PORT = process.env.PORT || 3001;
const id = generateUniqueId ();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json" , "utf-8",  (err,data) => {
        if (err) {
           throw err 
        }
        res.status(200).json(JSON.parse (data));
    })
    
    console.info (`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to add a note`);
    console.info (`${req.method} request received to add a note`);

    const { title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: generateUniqueId (),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'sucess',
            body: newNote,
        };
        
    
    }
    
});
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.listen(PORT, () => 
    console.log (`App listening at http://localhost:${PORT}`)
)