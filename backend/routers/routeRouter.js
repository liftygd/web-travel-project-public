const express = require('express');
const Route = require('../models/routeModel');
const router = new express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/routes").get((req, res) => {
    Route.find()
      .then(foundRoutes => res.json(foundRoutes))
});

router.route("/routes/public").get((req, res) => {
    Route.find({ isPublished: true })
        .sort({ publishDate: -1 })
        .then(foundRoutes => res.json(foundRoutes))
});

router.route("/routes/byUser/:userID").get((req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.params.userID)) { return null; }

    Route.find({ userID: req.params.userID })
        .sort({ _id: -1 })
        .then(foundRoutes => res.json(foundRoutes))
});

router.route("/routes/byID/:reviewID").get((req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.params.reviewID)) { return null; }

    Route.findOne({ _id: req.params.reviewID })
      .then(foundRoutes => res.json(foundRoutes))
});

router.route("/routes/add").post(upload.single('image'), function(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const userID = req.body.userID;
    const pointsArray = req.body.pointsArray;
    const isPublished = req.body.isPublished;
    let publishDate = req.body.publishDate;

    if (isPublished === 'false'){
        publishDate = 0;
    }
  
    const newRoute = new Route({
        title: title,
        description: description,
        userID: userID,
        isPublished: isPublished,
        publishDate: publishDate,
        pointsArray: pointsArray,
        comments: [{}]
    });
  
    newRoute.save();
});

router.route('/routes/edit').post(upload.single('image'), async function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.body.id)) { return null; }

    let route = null; 
    await Route.findOne({_id: req.body.id}).then(foundRoute => route = foundRoute);

    const title = req.body.title;
    const description = req.body.description;
    const pointsArray = req.body.pointsArray;
    const isPublished = req.body.isPublished;
    let publishDate = route.publishDate == 0 ? req.body.publishDate : route.publishDate;

    if (isPublished === 'false' && route.publishDate == 0) {
        publishDate = 0;
    }

    await Route.updateOne({_id: req.body.id}, { $set:{
        title: title,
        description: description,
        pointsArray: pointsArray,
        isPublished: isPublished,
        publishDate: publishDate
    }});
});

router.route('/routes/comments/add').post(upload.single('image'), async function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.body.id)) { return null; }

    let route = null; 
    await Route.findOne({_id: req.body.id}).then(foundRoute => route = foundRoute);

    let comments = route.comments;
    comments.push({
        userName: req.body.userName,
        postDate: req.body.postDate,
        comment: req.body.comment
    });

    await Route.updateOne({_id: req.body.id}, { $set:{
        comments: comments
    }});
});

router.route('/routes/scores/updateScore').post(async function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    if (!ObjectId.isValid(req.body.id)) { return null; }
  
    let route = null; 
    await Route.findOne({_id: req.body.id}).then(foundRoute => route = foundRoute);

    let score = route.userScore;
    score += req.body.score;
  
    await Route.updateOne({_id: req.body.id}, { $set:{
      userScore: score
    }});
});

module.exports = router;