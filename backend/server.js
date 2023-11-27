const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());

// Define MongoDB connection URL
const mongoURL = 'mongodb+srv://kristaldsouza:Kristal19@cluster0.vbvc8wx.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const authRoutes = require('./routes/authRoutes');
const audioRoutes = require('./routes/audioRoutes');
const employeeRoutes = require('./routes/employeeRoutes')



app.use(express.json());
app.use(cors());
app.use(authRoutes);
app.use(employeeRoutes);
app.use(audioRoutes);




const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
