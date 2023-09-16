const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

const generateUniqueId = () => {
  return uuidv4();
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});



// API Routes
app.get('/api/notes', (req, res) => {
  // Read the contents of the db.json file and return as JSON
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  // Read existing notes from the db.json file
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const notes = JSON.parse(data);

    // Generate a unique ID for the new note (you can use an npm package for this)
    newNote.id = generateUniqueId();

    // Add the new note to the existing notes array
    notes.push(newNote);

    // Write the updated notes array back to the db.json file
    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(newNote);
    });
  });
});

// Implement the DELETE route here

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});