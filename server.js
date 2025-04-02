// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// Initialize SQLite database
const db = new sqlite3.Database('./projects.db', (err) => {
    if (err) console.error('Database error:', err.message);
    else console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            value REAL,
            due_date TEXT,
            status TEXT,
            client TEXT,
            startDate TEXT,
            progress INTEGER
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            name TEXT,
            type TEXT,
            uploaded_date TEXT,
            status TEXT,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )
    `);
});

// API Endpoints
app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projects', [], (err, rows) => {
        if (err) {
            console.error('GET /api/projects error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/projects', (req, res) => {
    const { name, value, due_date, status, client, startDate, progress } = req.body;
    db.run(
        'INSERT INTO projects (name, value, due_date, status, client, startDate, progress) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, value, due_date, status, client, startDate, progress],
        function (err) {
            if (err) {
                console.error('POST /api/projects error:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

app.get('/api/documents', (req, res) => {
    db.all('SELECT * FROM documents', [], (err, rows) => {
        if (err) {
            console.error('GET /api/documents error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/documents', (req, res) => {
    const { project_id, name, type, uploaded_date, status } = req.body;
    db.run(
        'INSERT INTO documents (project_id, name, type, uploaded_date, status) VALUES (?, ?, ?, ?, ?)',
        [project_id, name, type, uploaded_date, status],
        function (err) {
            if (err) {
                console.error('POST /api/documents error:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Fallback to serve dashboard.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});