// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'notes.db');
const db = new sqlite3.Database(dbPath);

// Create notes table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)");
});

// Routes
app.post('/notes', (req, res) => {
  const { content } = req.body;
  db.run('INSERT INTO notes (content) VALUES (?)', [content], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notes WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
