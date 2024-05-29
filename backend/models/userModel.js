const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  confirmedEmail: {
    type: Boolean,
    required: true
  },
  favouriteReviews: [{
    reviewID: String
  }],
  favouriteRoutes: [{
    routeID: String
  }],
  scores: [{
    postID: String,
    score: Number
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
