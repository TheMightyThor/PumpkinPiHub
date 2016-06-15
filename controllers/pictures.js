var express = require('express')
    , router = express.Router()
    , multer = require('multer');

var uploading = multer({
    dest: __dirname + '../public/uploads/'
});

router.post('/upload', uploading, function(req, res) {

});

module.exports = router;