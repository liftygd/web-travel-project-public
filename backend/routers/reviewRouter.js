const express = require('express');
const Review = require('../models/reviewModel');
const router = new express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/reviews").get((req, res) => {
    Review.find()
      .then(foundReviews => res.json(foundReviews))
});

router.route("/reviews/public").get((req, res) => {
    Review.find({ isPublished: true })
        .sort({ publishDate: -1 })
        .then(foundReviews => res.json(foundReviews))
});

router.route("/reviews/byUser/:userID").get((req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.params.userID)) { return null; }

    Review.find({ userID: req.params.userID })
        .sort({ _id: -1 })
        .then(foundReviews => res.json(foundReviews))
});

router.route("/reviews/byID/:reviewID").get((req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.params.reviewID)) { return null; }

    Review.findOne({ _id: req.params.reviewID })
      .then(foundReviews => res.json(foundReviews))
});

router.route("/reviews/add").post(upload.single('image'), function(req, res) {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const description = req.body.description;
    const stars = req.body.stars;
    const userID = req.body.userID;
    const isPublished = req.body.isPublished;

    let publishDate = req.body.publishDate;

    if (isPublished === 'false'){
        publishDate = 0;
    }
  
    const newReview = new Review({
        title,
        shortDescription,
        description,
        stars,
        reviewImage: {
            data: req.file.buffer,
            contentType: 'image/jpeg'
        },
        userID,
        isPublished,
        publishDate,
        comments: [{}]
    });
  
    newReview.save();
});

router.route('/reviews/edit').post(upload.single('image'), async function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.body.id)) { return null; }

    let review = null; 
    await Review.findOne({_id: req.body.id}).then(foundReview => review = foundReview);

    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const description = req.body.description;
    const stars = req.body.stars;
    const isPublished = req.body.isPublished;
    let publishDate = review.publishDate == 0 ? req.body.publishDate : review.publishDate;

    if (isPublished === 'false' && review.publishDate == 0) {
        publishDate = 0;
    }

    let img_data;
    if (req.body.image == "undefined")
        img_data = review.reviewImage.data;
    else 
        img_data = req.file.buffer;

    await Review.updateOne({_id: req.body.id}, { $set:{
        title: title,
        shortDescription: shortDescription,
        description: description,
        stars: stars,
        reviewImage: {
            data: img_data,
            contentType: 'image/jpeg'
        },
        isPublished: isPublished,
        publishDate: publishDate
    }});
});

router.route('/reviews/comments/add').post(upload.single('image'), async function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.body.id)) { return null; }

    let review = null; 
    await Review.findOne({_id: req.body.id}).then(foundReview => review = foundReview);

    let comments = review.comments;
    comments.push({
        userName: req.body.userName,
        postDate: req.body.postDate,
        comment: req.body.comment
    });

    await Review.updateOne({_id: req.body.id}, { $set:{
        comments: comments
    }});
});

router.route('/reviews/scores/updateScore').post(async function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.body.id)) { return null; }
  
    let review = null; 
    await Review.findOne({_id: req.body.id}).then(foundReview => review = foundReview);

    let score = review.userScore;
    score += req.body.score;
  
    await Review.updateOne({_id: req.body.id}, { $set:{
      userScore: score
    }});
});

module.exports = router;