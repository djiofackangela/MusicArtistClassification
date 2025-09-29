const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Artists ---
app.get('/artists', (req, res) => {
  const { genre, country, popularity } = req.query;
  res.json({ message: 'List artists (dummy)', genre, country, popularity });
});

app.get('/artists/:id', (req, res) => {
  res.json({ message: `Artist details for ${req.params.id}` });
});

app.post('/artists', (req, res) => {
  res.status(201).json({ message: 'Artist created (dummy)', data: req.body });
});

app.put('/artists/:id', (req, res) => {
  res.json({ message: `Artist ${req.params.id} classification updated (dummy)`, data: req.body });
});

app.delete('/artists/:id', (req, res) => {
  res.json({ message: `Artist ${req.params.id} deleted (dummy)` });
});

// --- Classifications ---
app.get('/classifications', (req, res) => res.json({ message: 'List classifications (dummy)' }));
app.post('/classifications', (req, res) => res.json({ message: 'Add classification (dummy)', data: req.body }));

// --- Auth / Users (dummy) ---
app.post('/auth/signup', (req, res) => res.status(201).json({ message: 'Signup (dummy)', data: req.body }));
app.post('/auth/login', (req, res) => res.json({ message: 'Login (dummy)', token: 'fake-jwt-token' }));
app.get('/users/:id/favorites', (req, res) => res.json({ message: `Favorites for ${req.params.id}`, favorites: [] }));
app.post('/users/:id/favorites', (req, res) => res.json({ message: `Added favorite for ${req.params.id}`, data: req.body }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
