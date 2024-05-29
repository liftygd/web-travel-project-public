const express = require('express');
const ImageSchema = require('../models/imageModel');
const router = new express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/upload/image').post(upload.single('image'), function(req, res) {
    var new_img = new ImageSchema;
    new_img.img.data = req.file.buffer;
    new_img.img.contentType = 'image/jpeg';
    new_img.save();
    res.json({ message: 'New image added to the db!' });
});

router.route('/get/image').get(function(req, res) {
    ImageSchema.findOne().then(foundImage => {
        res.contentType('json');
        res.send(foundImage);
    });
});

module.exports = router;