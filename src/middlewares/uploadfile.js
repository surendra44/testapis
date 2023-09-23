const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})
var upload = multer({
    storage: storage,
    filefilter: function (req, file, callback) {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ) {
            callback(null, true)
        } else {
            console.log('only png and jpg files are supported!')
            callback(null,false)
        }
    }
}).any('photoUrl')


module.exports = {upload}