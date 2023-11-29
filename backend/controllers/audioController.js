const multer = require('multer');
const path = require('path');
const { analyzeAudio } = require('./audioAnalyzer.js'); // Import the audioAnalyzer module

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
exports.uploadAudio = upload.array('audioFiles');

exports.processAudio = async (req, res) => {
    if (req.files.length === 0) {
        return res.status(400).json({ error: 'No audio files were uploaded' });
    }

    try {
        // Process each file with analyzeAudio and await the results
        const analysisPromises = req.files.map(file => analyzeAudio(file.path));
        const analysisResults = await Promise.all(analysisPromises);

        // Combine results and send back to frontend
        res.status(200).json(analysisResults);
    } catch (error) {
        console.error('Error processing audio files:', error);
        res.status(500).json({ error: 'Error processing audio files' });
    }
};
