const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const HOUSE_LIST = (process.env.HOUSE_LIST || 'Unknown').split(',').map(s => s.trim());
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'gotdb',
  port: process.env.DB_PORT || 5432,
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/houses', (req, res) => {
  const data = HOUSE_LIST.map(h => ({ house: h, description: `Short blurb for House ${h}` }));
  res.json(data);
});

app.post('/questions', async (req, res) => {
  const { house, question } = req.body;
  if (!house || !question) return res.status(400).json({ error: 'house & question required' });
  try {
    const q = 'INSERT INTO questions(house, question) VALUES($1,$2) RETURNING id, created_at';
    const r = await pool.query(q, [house, question]);
    res.json({ ok: true, id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/questions', async (req, res) => {
  try {
    const r = await pool.query('SELECT id, house, question, created_at FROM questions ORDER BY created_at DESC LIMIT 100');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.listen(PORT, () => console.log(`house-app listening on ${PORT}, houses=${HOUSE_LIST}`));
