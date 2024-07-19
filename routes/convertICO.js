const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const upload = require("../config/upload");
const path = require('path');

router.post('/convertICO', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    // Kiểm tra kích thước file tại phía server (API)
    if (req.file.size > 1024 * 1024) { // 1MB = 1024 * 1024 bytes
        return res.status(400).json({ error: 'File size exceeds 1MB limit.' });
    }

    try {
        let image = sharp(req.file.buffer);

        // Kiểm tra đuôi của file gốc
        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext !== '.ico') {
            // Chuyển đổi sang đuôi jpg
            image = image.jpeg();
        }

        const jpgBuffer = await image.toBuffer();
        const base64Image = jpgBuffer.toString('base64');
        const originalFilename = req.file.originalname;
        const originalSize = req.file.size;
        const newFilename = originalFilename.replace(/\.[^/.]+$/, ".ico");
        const newSize = jpgBuffer.length;

        res.json({
            base64: base64Image,
            originalFilename: originalFilename,
            originalSize: originalSize,
            newFilename: newFilename,
            newSize: newSize
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the image.' });
    }
});
module.exports = router

