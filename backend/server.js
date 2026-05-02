const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user'); 
const taskTypeRoutes = require('./routes/taskType');
const timeLogRoutes = require('./routes/timeLog');
const munkaoraRoutes = require('./routes/munkaorak');
const adminRoutes = require('./routes/admin'); // Új import

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasktypes', taskTypeRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/munkaorak', munkaoraRoutes);
app.use('/api/admin', adminRoutes); // Új bekötés

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4 
})
  .then(() => console.log('✅ MongoDB kapcsolat kész!'))
  .catch((err) => console.error('❌ MongoDB hiba:', err.message));

app.get('/', (req, res) => res.send('Backend fut!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Szerver: http://localhost:${PORT}`));