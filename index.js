const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const mongoose = require('mongoose');
 
const app = express();
const PORT = 3000;
 
mongoose.connect('mongodb://localhost:27017/myFileStorage')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
 
const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  hash: { type: String, unique: true },
  data: Buffer
});
const File = mongoose.model('File', fileSchema);
 
const upload = multer({ storage: multer.memoryStorage() });
 
app.post('/upload', upload.single('myFile'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
 
    const existing = await File.findOne({ hash: fileHash });
    if (existing) {
      return res.status(409).send('Duplicate file detected. Upload aborted.');
    }
 
    const newFile = new File({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      hash: fileHash,
      data: fileBuffer
    });
 
    await newFile.save();
    res.send('File uploaded and saved to MongoDB.');
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Error uploading file.');
  }
});
 
app.get('/download/:filename', async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).send('File not found in DB.');
 
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`
    });
    res.send(file.data);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Error downloading file.');
  }
});
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
 
 