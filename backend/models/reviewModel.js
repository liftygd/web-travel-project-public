const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true
  },
  reviewImage: {
    data: Buffer, 
    contentType: String
  },
  userID: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    required: true
  },
  publishDate: {
    type: Number,
    required: true
  },
  comments: [{
    userName: String,
    postDate: Number,
    comment: String
  }],
  userScore: {
    type: Number,
    required: false
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
