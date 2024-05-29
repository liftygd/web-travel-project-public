const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = new express.Router();
const bcrypt = require('bcrypt');

const verificationEmail = require('../services/verificationEmail');
const userNameRestoreEmail = require('../services/userNameRestoreEmail');
const passwordRestoreEmail = require('../services/passwordRestoreEmail');

router.route("/users").get((req, res) => {
  User.find()
    .then(foundUsers => res.json(foundUsers))
});

router.route("/userByName/:userName").get((req, res) => {
  User.findOne({userName: req.params.userName})
    .then(foundUsers => res.json(foundUsers))
});

router.route("/userByEmail/:email").get((req, res) => {
  User.findOne({email: req.params.email})
    .then(foundUsers => res.json(foundUsers))
});

//user verification
router.route("/users/verify/:email&:password").get((req, res) => {
  let userData = req.params;
  User.findOne({email: userData.email, confirmedEmail: true})
    .then(async foundUser => {
      await bcrypt.compare(userData.password, foundUser.password, (err, result) => {
        res.send(result);
      })
    }
    );
});

router.route("/register").post(async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const userName = req.body.userName;
  const password = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;

  const emailToken = jwt.sign({
    username: req.body.userName
  }, "secret_webdesignproject_travellershut");
  verificationEmail.verifyUserEmail(req.body.email, req.body.userName, emailToken);

  const newUser = new User({
    userName,
    password,
    email,
    confirmedEmail: false,
    favouriteReviews: [{}],
    favouriteRoutes: [{}]
  });

  newUser.save();
});

router.post('/verifyEmailToken', async (req, res) => {
  User.findOne({userName: req.params.userName}).then(function (err, result) {
    try {
      const decode = jwt.verify(req.body.emailToken, "secret_webdesignproject_travellershut");
      console.log(decode);

      let f = User.updateOne({userName: req.body.userName}, 
        {
          $set:{
            confirmedEmail: true,
          }
        }).then(console.log('User found and Modified email token'));
      
        return res.json({ status: 'okay'});
    } catch (err) {
      console.log(err);
      return res.json({ status: 'error'});
    }
  });
});

//restore credentials
router.route("/sendResetUsername").post(async (req, res) => {
  const emailToken = jwt.sign({
    email: req.body.email
  }, "secret_webdesignproject_travellershut", { expiresIn: "30m" });
  userNameRestoreEmail.verifyUserEmail(req.body.email, emailToken);
});

router.post('/resetUsername', async (req, res) => {
  User.findOne({email: req.params.email}).then(function (err, result) {
    try {
      const decode = jwt.verify(req.body.emailToken, "secret_webdesignproject_travellershut");
      console.log(decode);

      let f = User.updateOne({email: req.body.email}, 
        {
          $set:{
            userName: req.body.userName,
          }
        }).then(console.log('User found and Modified email token'));
      
        return res.json({ status: 'okay'});
    } catch (err) {
      console.log(err);
      return res.json({ status: 'error'});
    }
  });
});

router.route("/sendResetPassword").post(async (req, res) => {
  const emailToken = jwt.sign({
    email: req.body.email
  }, "secret_webdesignproject_travellershut", { expiresIn: "30m" });
  passwordRestoreEmail.verifyUserEmail(req.body.email, emailToken);
});

router.post('/resetPassword', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  User.findOne({email: req.params.email}).then(function (err, result) {
    try {
      const decode = jwt.verify(req.body.emailToken, "secret_webdesignproject_travellershut");
      console.log(decode);

      let f = User.updateOne({email: req.body.email}, 
        {
          $set:{
            password: password,
          }
        }).then(console.log('User found and Modified email token'));
      
        return res.json({ status: 'okay'});
    } catch (err) {
      console.log(err);
      return res.json({ status: 'error'});
    }
  });
});

router.route('/users/favourites/addReview').post(async function(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  if (!ObjectId.isValid(req.body.id)) { return null; }

  let user = null; 
  await User.findOne({_id: req.body.id}).then(foundUser => user = foundUser);

  let favouriteReviews = user.favouriteReviews;
  favouriteReviews.push({
      reviewID: req.body.reviewID
  });

  await User.updateOne({_id: req.body.id}, { $set:{
    favouriteReviews: favouriteReviews
  }});
});

router.route('/users/favourites/addRoute').post(async function(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  if (!ObjectId.isValid(req.body.id)) { return null; }

  let user = null; 
  await User.findOne({_id: req.body.id}).then(foundUser => user = foundUser);

  let favouriteRoutes = user.favouriteRoutes;
  favouriteRoutes.push({
      routeID: req.body.routeID
  });

  await User.updateOne({_id: req.body.id}, { $set:{
    favouriteRoutes: favouriteRoutes
  }});
});

router.route('/users/scores/addScore').post(async function(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  if (!ObjectId.isValid(req.body.id)) { return null; }

  let user = null; 
  await User.findOne({_id: req.body.id}).then(foundUser => user = foundUser);

  let scores = user.scores;
  scores.push({
      postID: req.body.postID,
      score: req.body.score
  });

  await User.updateOne({_id: req.body.id}, { $set:{
    scores: scores
  }});
});

router.route("/users/scores/getByPostID/:id&:postID").get(async function(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  if (!ObjectId.isValid(req.params.id)) { return null; }

  let user = null; 
  await User.findOne({_id: req.params.id}).then(foundUser => user = foundUser);

  let score = {};
  user.scores.forEach(scoreItem => {
    if (scoreItem.postID == req.params.postID) {
      score = scoreItem;
    }
  });

  res.send(score);
});

router.route('/users/scores/updateByPostID').post(async function(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  if (!ObjectId.isValid(req.body.id)) { return null; }

  let user = null; 
  await User.findOne({_id: req.body.id}).then(foundUser => user = foundUser);

  let scores = user.scores;

  for (let i = 0; i < scores.length; i++) {
    if (scores[i].postID != req.body.postID) continue;

    scores[i].score = req.body.score;
    break;
  }

  await User.updateOne({_id: req.body.id}, { $set:{
    scores: scores
  }});
});

module.exports = router;