const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const upload = require("../config/upload");
// API để chuyển đổi ảnh sang PNG và trả về thông tin file

router.post('/convertPNG', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const pngBuffer = await sharp(req.file.buffer).png().toBuffer();
        const base64Image = pngBuffer.toString('base64');
        const originalFilename = req.file.originalname;
        const originalSize = req.file.size;
        const newFilename = originalFilename.replace(/\.[^/.]+$/, ".png");
        const newSize = pngBuffer.length;

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

module.exports = router;
