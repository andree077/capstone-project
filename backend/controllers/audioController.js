const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

exports.uploadAudio = upload.array('audioFiles');

exports.processAudio = (req, res) => {
  if (req.files.length === 0) {
    return res.status(400).json({ error: 'No audio files were uploaded' });
  }
  // Handle and process the audio files
  res.status(200).json({ message: 'Audio files uploaded and processed successfully' });
};
