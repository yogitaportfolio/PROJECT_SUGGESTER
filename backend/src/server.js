require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

//app.use('/api/projects', require('./routes/projects'));
app.use('/api/ai', require('./routes/ai'));

app.get('/', (req, res) => res.send('Project Suggester Backend'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
