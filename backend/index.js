const express = require('express');
const cors = require('cors');
const db = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// Login mock
app.post('/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === 'admin' && pass === 'urbinanet2024') return res.json({ ok: true });
  res.status(401).json({ ok: false });
});

// Obtener clientes
app.get('/clientes', async (req, res) => {
  const snapshot = await db.collection('clientes').get();
  const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(data);
});

// Crear cliente
app.post('/clientes', async (req, res) => {
  await db.collection('clientes').add(req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
