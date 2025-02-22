const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
ffmpeg.setFfmpegPath(ffmpegPath);

app.use(express.static('public'));

app.post('/convert', upload.single('file'), (req, res) => {
    const inputFile = req.file.path;
    const outputFile = path.join('converted', `${req.file.filename}.mp3`);

    ffmpeg(inputFile)
        .toFormat('mp3')
        .on('end', () => {
            res.download(outputFile, 'converted.mp3', (err) => {
                if (err) console.error('Error:', err);
            });
        })
        .on('error', (err) => {
            console.error('Error converting file:', err);
            res.status(500).send('Error converting file.');
        })
        .save(outputFile);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
