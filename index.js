require('dotenv').config();
const express = require('express');
const cors = require('cors');

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET belum diatur");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/menuRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'API Access Management Ready' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});