import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import "../../main.css";
import routesStyle from "./RouteStyle.module.css";
import routesPageStyle from "../pages/RoutesPageStyle.module.css"
import routeReadStyle from "./RouteReadStyle.module.css";
import commentPageStyles from "../comments/CommentPageStyle.module.css";

import moment from 'moment';
import Map from "./Map.jsx";
import CommentHeader from '../comments/CommentHeader.jsx';

import DotLine from "../../images/routes/dotted-line.svg";
import TransportWalk from "../../images/routes/transport-walk.svg";
import TransportCar from "../../images/routes/transport-car.svg";
import TransportTrain from "../../images/routes/transport-train.svg";
import TransportBus from "../../images/routes/transport-bus.svg";
import TransportPlane from "../../images/routes/transport-plane.svg";
import TransportShip from "../../images/routes/transport-ship.svg";

import PostDislikeEmpty from "../../images/rating/post_dislike_empty.svg";
import PostDislikeFull from "../../images/rating/post_dislike_full.svg";
import PostLikeEmpty from "../../images/rating/post_like_empty.svg";
import PostLikeFull from "../../images/rating/post_like_full.svg";

const RoutesReadPage = () => {
    let { routeID } = useParams();
    let [ route, setRoute ] = useState(null);
    let [ points, setPoints ] = useState([]);

    const [input, setInput] = useState([{
        comment: '',
    }]);
    let { commentsPage } = useParams();
    const [canComment, setCanComment] = useState(true);

    let [ liked, setLiked ] = useState(null);
    let [ likeImages, setLikeImages ] = useState([PostLikeEmpty, PostDislikeEmpty]);
    const [ canLike, setCanLike ] = useState(true);

    const transportModes = {
        'Walk': TransportWalk,
        'Car': TransportCar,
        'Train': TransportTrain,
        'Bus': TransportBus,
        'Plane': TransportPlane,
        'Ship': TransportShip
    };

    function handleChange(event) {
        const {name, value} = event.target;

        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        });
    }

    useEffect(()=>{
        loadRoute();
        loadComments();
    }, [commentsPage]);

    async function loadRoute() {
        const loadedRoute = (await axios.get(`BACKEND_ADDRESS/routes/byID/${routeID}`)).data;
        setRoute(loadedRoute);

        let pointsTemp = [];
        for (let i = 0; i < loadedRoute.pointsArray.length; i++) {
            pointsTemp.push(<div className={ `${routeReadStyle.cell}`}>
                <h2>{loadedRoute.pointsArray[i].title} {loadedRoute.pointsArray[i].linkedReview != "" ? <Link to={`/reviews/read/${loadedRoute.pointsArray[i].linkedReview}/1`} target="_blank" className={routesStyle.publishDate}> (Read review)</Link> : ""}</h2>
                <h3 className={routesStyle.publishDate}></h3>
                <h3 className={routesStyle.publishDate}>{moment(new Date(loadedRoute.pointsArray[i].date)).format("MMM Do YYYY")}</h3>
                <h3 className={routesStyle.publishDate}>lat: {loadedRoute.pointsArray[i].latitude.toFixed(5)} - lng: {loadedRoute.pointsArray[i].longitude.toFixed(5)}</h3>

                <h3 className={routeReadStyle.routeDescription}>{loadedRoute.pointsArray[i].description}</h3>
            </div>);
            
            if (i == loadedRoute.pointsArray.length - 1) break;

            pointsTemp.push(<div className={routeReadStyle.routePointsImage}>
                <img src={DotLine}></img>
                <img src={transportModes[loadedRoute.pointsArray[i + 1].transportMode]}></img>
            </div>);
        }
        
        setPoints(pointsTemp);

        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            setCanComment(false);
            setCanLike(false);
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        const checkScore = (await axios.get(`BACKEND_ADDRESS/users/scores/getByPostID/${foundUser._id}&${routeID}`)).data;
        if (Object.keys(checkScore).length === 0) return;

        let isLiked = checkScore.score == 1 ? 'true' : (checkScore.score == 0 ? null : 'false');
        setLiked(isLiked);
        getLikeImages(isLiked);
    }

    async function handleScore(event) {
        let newScore = 0;
        let oldScore = (liked == 'true') ? 1 : (liked == null ? 0 : -1);

        if (liked != event.currentTarget.value) {
            setLiked(event.currentTarget.value);
            getLikeImages(event.currentTarget.value);
            newScore = (event.currentTarget.value == 'true') ? 1 : -1;
        }
        else {
            setLiked(null);
            getLikeImages(null);
        }

        const loggedInUser = localStorage.getItem('user');
        const foundUser = JSON.parse(loggedInUser);
        const checkScore = (await axios.get(`BACKEND_ADDRESS/users/scores/getByPostID/${foundUser._id}&${routeID}`)).data;
        if (Object.keys(checkScore).length === 0) {
            await Promise.all([
                axios.post(`BACKEND_ADDRESS/users/scores/addScore`, { id: foundUser._id, postID: routeID, score: newScore }),
                axios.post(`BACKEND_ADDRESS/routes/scores/updateScore`, { id: routeID, score: newScore })
            ]);
        }
        else {
            let changePostScore = newScore - oldScore;

            await Promise.all([
                axios.post(`BACKEND_ADDRESS/users/scores/updateByPostID`, { id: foundUser._id, postID: routeID, score: newScore }),
                axios.post(`BACKEND_ADDRESS/routes/scores/updateScore`, { id: routeID, score: changePostScore })
            ]);
        }
    }

    function getLikeImages(isLiked) {
        if (isLiked == 'true') {
            setLikeImages([PostLikeFull, PostDislikeEmpty]);
        }
        else if (isLiked == 'false') {
            setLikeImages([PostLikeEmpty, PostDislikeFull]);
        }
        else {
            setLikeImages([PostLikeEmpty, PostDislikeEmpty]);
        }
    }

    function postComment(event) {
        event.preventDefault();

        const loggedInUser = localStorage.getItem('user');
        const foundUser = JSON.parse(loggedInUser);

        const newComment = {
            id: routeID,
            userName: foundUser.userName,
            postDate: Date.now(),
            comment: input.comment
        };

        if (newComment.comment === undefined || newComment.comment === '') {
            return;
        }

        axios.post(`BACKEND_ADDRESS/routes/comments/add`, newComment);
        window.location.reload();
    }

    //Comment generation
    let [ pageSelector, setPageSelector ] = useState([]);
    let [ pageComments, setPageComments ] = useState([]);

    commentsPage = parseInt(commentsPage, 10);

    async function loadComments() {
        const loadedRoute = (await axios.get(`BACKEND_ADDRESS/routes/byID/${routeID}`)).data;
        const loadedComments = loadedRoute.comments.reverse();
        if (loadedComments.length <= 0) {
            return;
        }

        let createPageSelector = [];
        let createPageRoutes = [];

        //Page reviews
        for (let i = (commentsPage - 1) * 12; i < commentsPage * 12; i++) {
            if (i >= loadedComments.length) break;

            const commentData = loadedComments[i];

            createPageRoutes.push(<CommentHeader 
                userName={commentData.userName}
                postDate={moment(new Date(commentData.postDate)).format("MMM Do YYYY")}
                comment={commentData.comment}
            />);
        }

        const pageAmount = Math.ceil(loadedComments.length / 12);
        const pageDiff = 3;

        //Page selector
        if (commentsPage > 1) {
            createPageSelector.push(<button><Link to={`/routes/read/${routeID}/1`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#60;&#60;</Link></button>);
            createPageSelector.push(<button><Link to={`/routes/read/${routeID}/${commentsPage - 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#60;</Link></button>);
        }
        if (commentsPage - pageDiff > 0) createPageSelector.push(<button>...</button>);

        for (let i = commentsPage - pageDiff - 1; i < commentsPage + pageDiff; i++) {
            if (i < 0) i = 0;
            if (i >= pageAmount) break;

            if (i + 1 == commentsPage)
                createPageSelector.push(<button className={routesPageStyle.selectedPageButton}><Link to={`/routes/read/${routeID}/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
            else
                createPageSelector.push(<button><Link to={`/routes/read/${routeID}/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
        }

        if (commentsPage + pageDiff < pageAmount) createPageSelector.push(<button>...</button>);
        if (commentsPage < pageAmount) {
            createPageSelector.push(<button><Link to={`/routes/read/${routeID}/${commentsPage + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;</Link></button>);
            createPageSelector.push(<button><Link to={`/routes/read/${routeID}/${pageAmount}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;&#62;</Link></button>);
        }

        setPageComments(createPageRoutes);
        setPageSelector(createPageSelector);
    }

    return (
        <>
            {route == null ? <div></div> :
            <div className={ `${routesPageStyle.main} center` }>
                <div className={ `${routesPageStyle.backgroundImage} center`}>
                    <h2 className={ `${routesPageStyle.text} ${routesPageStyle.h2}` }>{route.title}</h2>
                    <p className={routesPageStyle.text}>{route.isPublished ? `${moment(new Date(route.publishDate)).format("MMM Do YYYY")}` : "Not published"} | {route.pointsArray[0].title} - {route.pointsArray[route.pointsArray.length - 1].title}</p>
                    <p className={routesPageStyle.text}>User Score: {route.userScore}</p>
                </div>

                <div className={ `${routesStyle.reviewReadContainer}`}>
                    <textarea name="title" placeholder='Title' rows="1" maxLength="109" value={route.title} readOnly></textarea>
                    <textarea name="description"  placeholder='Full Description' rows="10" maxLength="1090" value={route.description} readOnly></textarea>
                </div>

                <div className={ `${routeReadStyle.routeContainer}`}>
                    <div className={ `${routeReadStyle.routePoints}`}>
                        {points}
                    </div>

                    <div className={ `${routeReadStyle.routeMap}`}>
                        <Map 
                            points={route.pointsArray}
                            zoom={6}
                        />
                    </div>
                </div>

                <br></br><br></br><br></br>

                {!canLike ? <div></div> :
                <>
                    <h2>Rate This Route</h2>
                    <div className={`${routesStyle.scoreArea}`}>
                        <button className={`grow`} onClick={handleScore} value={'true'}><img src={likeImages[0]}></img></button>
                        <button className={`grow`} onClick={handleScore} value={'false'}><img src={likeImages[1]}></img></button>
                    </div>
                </>
                }

                {!canComment ? <div></div> :
                <div className={ `${routesStyle.reviewReadContainer}`}>
                    <textarea name="comment" placeholder='Write your comment' rows="3" maxLength="327" onChange={handleChange}></textarea>
                    <button className={ `${routesStyle.reviewButton}` } onClick={postComment}>Post comment</button>
                </div>
                }

                <div className={commentPageStyles.main}>
                    <div className={ `${commentPageStyles.gallery} center ${commentPageStyles.pageSelector}`} style={{ marginTop: "100px" }}>
                        {pageSelector}
                    </div>

                    <div className={ `${commentPageStyles.gallery} ${commentPageStyles.reviewsGrid} center`}>
                        {pageComments}
                    </div>

                    <div className={ `${commentPageStyles.gallery} center ${commentPageStyles.pageSelector}`} style={{ marginBottom: "100px" }}>
                        {pageSelector}
                    </div>
                </div>
            </div>
            }
        </>
    );
};

export default RoutesReadPage;