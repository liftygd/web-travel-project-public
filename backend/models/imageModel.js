const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    img: { data: Buffer, contentType: String}
});
  
const ImageSchema = mongoose.model('Image', imageSchema);
module.exports = ImageSchema;