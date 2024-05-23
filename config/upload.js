const multer = require('multer');
const path = require("path");

const _storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: _storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 3 // 1MB
    // },
    // fileFilter: (req, file, cb) => {
    //     const filetypes = /jpeg|jpg|png|gif/;
    //     const mimetype = filetypes.test(file.mimetype);
    //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //
    //     if (mimetype && extname) {
    //         return cb(null, true);
    //     } else {
    //         cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    //     }
    // }
});

module.exports = upload;