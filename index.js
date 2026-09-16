require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'API Access Management Ready' });
});

// Import Routes (disiapkan untuk tahap berikutnya)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/user', require('./routes/menuRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});