const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');

router.post('/upload-audio', audioController.uploadAudio, audioController.processAudio);

module.exports = router;
