const { spawn } = require('child_process');
const path = require('path');

const analyzeAudio = (filePath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, 'audioAnalysis.py'), filePath]);

        let data = '';

        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk;
        });

        pythonProcess.stderr.on('data', (chunk) => {
            console.error('Python stderr:', chunk.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject('Python script exited with code ' + code);
            }
            try {
                const results = JSON.parse(data);
                resolve(results);
            } catch (error) {
                reject('Failed to parse Python script output:', error);
            }
        });
    });
};

module.exports = { analyzeAudio };
