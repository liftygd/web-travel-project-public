import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import CommentHeader from '../comments/CommentHeader';

import "../../main.css";
import reviewsStyle from "./ReviewStyle.module.css";
import reviewsPageStyle from "../pages/ReviewsPageStyle.module.css"
import commentPageStyles from "../comments/CommentPageStyle.module.css";

import PostDislikeEmpty from "../../images/rating/post_dislike_empty.svg";
import PostDislikeFull from "../../images/rating/post_dislike_full.svg";
import PostLikeEmpty from "../../images/rating/post_like_empty.svg";
import PostLikeFull from "../../images/rating/post_like_full.svg";

import moment from 'moment';

const ReviewsReadPage = () => {
    const [input, setInput] = useState([{
        comment: '',
    }]);

    let { reviewID } = useParams();
    let { commentsPage } = useParams();

    let [ liked, setLiked ] = useState(null);
    let [ likeImages, setLikeImages ] = useState([PostLikeEmpty, PostDislikeEmpty]);
    const [ canLike, setCanLike ] = useState(true);

    let [ review, setReview ] = useState(null);
    let [ reviewImage, setReviewImage ] = useState();
    const [canComment, setCanComment] = useState(true);

    useEffect(()=>{
        loadReview();
        loadComments();
    }, [commentsPage]);

    async function loadReview(){
        const loadedReview = (await axios.get(`BACKEND_ADDRESS/reviews/byID/${reviewID}`)).data;
        setReview(loadedReview);

        const base64Flag = 'data:image/jpeg;base64,';
        const imageStr = arrayBufferToBase64(loadedReview.reviewImage.data.data);

        setReviewImage(base64Flag + imageStr);

        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            setCanComment(false);
            setCanLike(false);
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        const checkScore = (await axios.get(`BACKEND_ADDRESS/users/scores/getByPostID/${foundUser._id}&${reviewID}`)).data;
        if (Object.keys(checkScore).length === 0) return;

        let isLiked = checkScore.score == 1 ? 'true' : (checkScore.score == 0 ? null : 'false');
        setLiked(isLiked);
        getLikeImages(isLiked);
    }

    function handleChange(event) {
        const {name, value} = event.target;

        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        });
    }

    function postComment(event) {
        event.preventDefault();

        const loggedInUser = localStorage.getItem('user');
        const foundUser = JSON.parse(loggedInUser);

        const newComment = {
            id: reviewID,
            userName: foundUser.userName,
            postDate: Date.now(),
            comment: input.comment
        };

        if (newComment.comment === undefined || newComment.comment === '') {
            return;
        }

        axios.post(`BACKEND_ADDRESS/reviews/comments/add`, newComment);
        window.location.reload();
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    function getStars() {
        let stars = "";
        for (let i = 0; i < 5; i++){
            if (i + 1 <= review.stars)
                stars += "★";
            else
                stars += "☆";
        }

        return stars;
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
        const checkScore = (await axios.get(`BACKEND_ADDRESS/users/scores/getByPostID/${foundUser._id}&${reviewID}`)).data;
        if (Object.keys(checkScore).length === 0) {
            await Promise.all([
                axios.post(`BACKEND_ADDRESS/users/scores/addScore`, { id: foundUser._id, postID: reviewID, score: newScore }),
                axios.post(`BACKEND_ADDRESS/reviews/scores/updateScore`, { id: reviewID, score: newScore })
            ]);
        }
        else {
            let changePostScore = newScore - oldScore;

            await Promise.all([
                axios.post(`BACKEND_ADDRESS/users/scores/updateByPostID`, { id: foundUser._id, postID: reviewID, score: newScore }),
                axios.post(`BACKEND_ADDRESS/reviews/scores/updateScore`, { id: reviewID, score: changePostScore })
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

    //Comment generation
    let [ pageSelector, setPageSelector ] = useState([]);
    let [ pageComments, setPageComments ] = useState([]);

    commentsPage = parseInt(commentsPage, 10);

    async function loadComments() {
        const loadedReview = (await axios.get(`BACKEND_ADDRESS/reviews/byID/${reviewID}`)).data;
        const loadedComments = loadedReview.comments.reverse();
        if (loadedComments.length <= 0) {
            return;
        }

        let createPageSelector = [];
        let createPageReviews = [];

        //Page reviews
        for (let i = (commentsPage - 1) * 12; i < commentsPage * 12; i++) {
            if (i >= loadedComments.length) break;

            const commentData = loadedComments[i];

            createPageReviews.push(<CommentHeader 
                userName={commentData.userName}
                postDate={moment(new Date(commentData.postDate)).format("MMM Do YYYY")}
                comment={commentData.comment}
            />);
        }

        const pageAmount = Math.ceil(loadedComments.length / 12);
        const pageDiff = 3;

        //Page selector
        if (commentsPage > 1) {
            createPageSelector.push(<button><Link to={`/reviews/read/${reviewID}/1`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#60;&#60;</Link></button>);
            createPageSelector.push(<button><Link to={`/reviews/read/${reviewID}/${commentsPage - 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#60;</Link></button>);
        }
        if (commentsPage - pageDiff > 0) createPageSelector.push(<button>...</button>);

        for (let i = commentsPage - pageDiff - 1; i < commentsPage + pageDiff; i++) {
            if (i < 0) i = 0;
            if (i >= pageAmount) break;

            if (i + 1 == commentsPage)
                createPageSelector.push(<button className={reviewsPageStyle.selectedPageButton}><Link to={`/reviews/read/${reviewID}/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
            else
                createPageSelector.push(<button><Link to={`/reviews/read/${reviewID}/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
        }

        if (commentsPage + pageDiff < pageAmount) createPageSelector.push(<button>...</button>);
        if (commentsPage < pageAmount) {
            createPageSelector.push(<button><Link to={`/reviews/read/${reviewID}/${commentsPage + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;</Link></button>);
            createPageSelector.push(<button><Link to={`/reviews/read/${reviewID}/${pageAmount}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;&#62;</Link></button>);
        }

        setPageComments(createPageReviews);
        setPageSelector(createPageSelector);
    }

    return (
        <>
            {review == null ? <div></div> :
            <div className={ `${reviewsPageStyle.main} center` }>
                <div className={ `${reviewsStyle.reviewBackground} center`} style={{ backgroundImage: `url(${reviewImage})` }}>
                    <h2 className={ `${reviewsPageStyle.text} ${reviewsPageStyle.h2}` }>{review.title}</h2>
                    <p className={reviewsPageStyle.text}>{review.shortDescription}</p>
                    <p className={reviewsPageStyle.text}>{review.isPublished ? `${moment(new Date(review.publishDate)).format("MMM Do YYYY")}` : "Not published"} | {getStars()}</p>
                    <p className={reviewsPageStyle.text}>User Score: {review.userScore}</p>
                </div>

                <div className={ `${reviewsStyle.reviewReadContainer}`}>
                    <textarea name="title" placeholder='Title' rows="1" maxLength="109" value={review.title} readonly></textarea>
                    <textarea name="shortDescription" placeholder='Short Description' maxLength="218" value={review.shortDescription} readonly></textarea>
                    <textarea name="description"  placeholder='Full Description' rows="20" maxLength="2180" value={review.description} readonly></textarea>
                </div>

                <br></br><br></br><br></br>

                {!canLike ? <div></div> :
                <>
                    <h2>Rate This Review</h2>
                    <div className={`${reviewsStyle.scoreArea}`}>
                        <button className={`grow`} onClick={handleScore} value={'true'}><img src={likeImages[0]}></img></button>
                        <button className={`grow`} onClick={handleScore} value={'false'}><img src={likeImages[1]}></img></button>
                    </div>
                </>
                }

                {!canComment ? <div></div> :
                <div className={ `${reviewsStyle.reviewReadContainer}`}>
                    <textarea name="comment" placeholder='Write your comment' rows="3" maxLength="327" onChange={handleChange}></textarea>
                    <button className={ `${reviewsStyle.reviewButton}` } onClick={postComment}>Post comment</button>
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

export default ReviewsReadPage;