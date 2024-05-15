const multer = require('multer');

const _storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: _storage});

module.exports = upload;