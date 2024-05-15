var express = require('express');
const path = require("path");
const fs = require("fs");
var router = express.Router();
const tiny = require("tinify")
const upload = require("../config/upload");
tiny.key = "RwWfDfrZ44KZn7GDSmMLpvlqGMpSJD2L";

/* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('index', {title: 'Express'});
// });

// Post one File
// router.post('/upload', upload.single("image"), function (req, res, next) {
//     try {
//         if (!req.file) {
//             return res.status(400).send('No files were uploaded.');
//         }
//         console.log("Init: " + req.file.size);
//
//         const source = tiny.fromFile(path.join(__dirname, '../public/uploads', req.file.filename));
//         const compressedPath = path.join(__dirname, '../public/images', req.file.filename);
//
//         source.toFile(compressedPath, (err) => {
//             if (err) {
//                 return res.status(500).send('Error compressing image.');
//             }
//             console.log("Successfully: " + fs.statSync(compressedPath).size);
//             res.download(compressedPath);
//         });
//     } catch (e) {
//
//         console.log(e);
//
//     }
// })

// Post any File
router.post('/upload', upload.array("image", 10), async function (req, res, next) {

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const compressedImages = [];

        for (const file of req.files) {
            const source = tiny.fromBuffer(file.buffer);
            const compressedBuffer = await source.toBuffer();

            const ext = file.mimetype.split('/')[1];

            // Tính toán dung lượng của ảnh gốc và sau khi nén
            const originalSize = file.size;
            const compSize = compressedBuffer.length;

            compressedImages.push({
                name: file.originalname,
                originalSize,
                compSize,
                buffer: compressedBuffer,
                format: ext
            });

        }

        console.log(compressedImages);

        // Trả về các ảnh đã nén
        res.json({
            compressedImages: compressedImages.map(img => ({
                name: img.name,
                originalSize: img.originalSize,
                compSize: img.compSize,
                buffer: img.buffer.toString('base64')  // Encode buffer to base64
            }))
        });

    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred.');
    }


})

router.get('/download/:filename', function (req, res) {
    try {
        const {filename} = req.params;
        const {base64Buffer} = req.query;  // Get the base64 buffer from query

        if (!base64Buffer) {
            return res.status(400).send('No image data provided.');
        }

        const buffer = Buffer.from(base64Buffer, 'base64');

        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${filename}"`
        });

        res.send(buffer);
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred.');
    }

});

module.exports = router;
