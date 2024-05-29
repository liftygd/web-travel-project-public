const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
  pointsArray: [{
    title: String,
    description: String,
    transportMode: String,
    longitude: Number,
    latitude: Number,
    date: Number,
    linkedReview: String
  }],
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

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
