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
const mongoURL = 'mongodb+srv://andreroy:Sjbhs2018@cluster0.vbvc8wx.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
     // Use this option
  });


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define MongoDB schemas and models for user data
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const employeeSchema = new mongoose.Schema({
  firstName: String,
  // Add more fields for employee data
});

const Employee = mongoose.model('Employee', employeeSchema);


app.post('/api/add-employee', async (req, res) => {
  try {
    const { firstName } = req.body;

    // Create a new employee document
    const newEmployee = new Employee({
      firstName,
      // Add more fields for employee data
    });

    // Save the employee data to the MongoDB database
    await newEmployee.save();
    res.status(200).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Define API endpoints for signup and login
app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.status(409).json({ error: 'Username already in use' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Projects/capstone-project/backend/uploads'); // Change this to your desired destination
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


app.post('/upload-audio', upload.array('audio'), (req, res) => {
  if (req.files.length === 0) {
    return res.status(400).json({ error: 'No audio files were uploaded' });
  }

  // Handle the uploaded files and process them

  res.status(200).json({ message: 'Audio files uploaded and processed successfully' });
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
