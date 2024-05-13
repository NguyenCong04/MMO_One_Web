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

        const compressedPaths = [];

        // Demo
        for (const file of req.files) {
            const source = tiny.fromFile(file.path);
            const compressedPath = path.join(__dirname, '../public/images', file.filename);

            // Giảm dung lượng của ảnh
            await source.toFile(compressedPath);

            // Tính toán dung lượng của ảnh gốc và sau khi nén
            const originalSize = file.size;
            const compSize = fs.statSync(compressedPath).size;

            compressedPaths.push({
                name: file.filename,
                originalSize,
                compSize
            });
        }
        console.log(compressedPaths);
        res.json({compressedPaths})
        for (const file of req.files) {
            fs.unlinkSync(file.path);
            console.log(file.path)
        }
    } catch (err) {
        console.log(err);
    }
})
router.get('/download/:filename', function (req, res) {
    const filename = req.params.filename;
    const file = path.join(__dirname, '../public/images', filename);
    res.download(file);
});

module.exports = router;
