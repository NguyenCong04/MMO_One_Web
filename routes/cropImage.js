const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const upload = require("../config/upload");

router.post('/processImage', upload.single('image'), async (req, res) => {
    try {
        const { width, height, x, y } = req.body;

        const parsedWidth = Math.round(Number(width));
        const parsedHeight = Math.round(Number(height));
        const parsedX = Math.round(Number(x));
        const parsedY = Math.round(Number(y));

        if (!req.file || !req.file.buffer) {
            throw new Error('No image file uploaded');
        }

        // Get metadata of the uploaded image
        const metadata = await sharp(req.file.buffer).metadata();
        console.log("Image metadata:", metadata);

        // Ensure crop dimensions are within bounds
        const adjustedX = Math.max(parsedX, 0);
        const adjustedY = Math.max(parsedY, 0);
        const adjustedWidth = Math.min(parsedWidth, metadata.width - adjustedX);
        const adjustedHeight = Math.min(parsedHeight, metadata.height - adjustedY);

        if (adjustedWidth <= 0 || adjustedHeight <= 0) {
            throw new Error('Invalid crop dimensions');
        }

        // Crop the image
        const imageBuffer = await sharp(req.file.buffer)
            .extract({ left: adjustedX, top: adjustedY, width: adjustedWidth, height: adjustedHeight })
            .toBuffer();

        const base64Image = imageBuffer.toString('base64');
        res.json({ metadata: { width: metadata.width, height: metadata.height }, image: base64Image });
    } catch (error) {
        console.error('Error processing image:', error.message);
        res.status(500).json({ error: 'Error processing image: ' + error.message });
    }
});

module.exports = router
