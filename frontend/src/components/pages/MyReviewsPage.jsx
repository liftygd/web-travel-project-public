import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ReviewHeader from "../reviews/ReviewHeader";
import ReviewCreateHeader from '../reviews/ReviewCreateHeader';

import "../../main.css";
import reviewsPageStyle from "./ReviewsPageStyle.module.css";

import moment from 'moment';

const MyReviewsPage = () => {
    let { pageNumber } = useParams();
    let [ pageSelector, setPageSelector ] = useState([]);
    let [ pageReviews, setPageReviews ] = useState([]);

    pageNumber = parseInt(pageNumber, 10);
    
    useEffect(()=>{
        loadReviews()
    }, []);

    async function loadReviews() {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        const loadedReviews = (await axios.get(`BACKEND_ADDRESS/reviews/byUser/${foundUser._id}`)).data;

        let createPageSelector = [];
        let createPageReviews = [];

        createPageReviews.push(<ReviewCreateHeader />);

        //Page reviews
        for (let i = (pageNumber - 1) * 12; i < pageNumber * 12; i++) {
            if (i >= loadedReviews.length) break;

            const reviewData = loadedReviews[i];

            var base64Flag = 'data:image/jpeg;base64,';
            var imageStr = arrayBufferToBase64(reviewData.reviewImage.data.data);

            let stars = "";
            for (let i = 0; i < 5; i++){
                if (i + 1 <= reviewData.stars)
                    stars += "★";
                else
                    stars += "☆";
            }

            createPageReviews.push(<ReviewHeader 
                title={reviewData.title}
                publishDate={reviewData.isPublished ? `${moment(new Date(reviewData.publishDate)).format("MMM Do YYYY")} | ${stars}` : "Not published"}
                shortDesc={reviewData.shortDescription}
                userScore={reviewData.userScore}
                image={base64Flag + imageStr}
                canEdit={true}
                reviewId={reviewData._id}
            />);
        }

        const pageAmount = Math.ceil(createPageReviews.length / 12);
        const pageDiff = 3;

        //Page selector
        if (pageNumber > 1) {
            createPageSelector.push(<button><Link to="/reviews/1" style={{ color: 'inherit', textDecoration: 'inherit' }}>&#60;&#60;</Link></button>);
            createPageSelector.push(<button><Link to={`/reviews/${pageNumber - 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#60;</Link></button>);
        }
        if (pageNumber - pageDiff > 0) createPageSelector.push(<button>...</button>);

        for (let i = pageNumber - pageDiff - 1; i < pageNumber + pageDiff; i++) {
            if (i < 0) i = 0;
            if (i >= pageAmount) break;

            if (i + 1 == pageNumber)
                createPageSelector.push(<button className={reviewsPageStyle.selectedPageButton}><Link to={`/reviews/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
            else
                createPageSelector.push(<button><Link to={`/reviews/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
        }

        if (pageNumber + pageDiff < pageAmount) createPageSelector.push(<button>...</button>);
        if (pageNumber < pageAmount) {
            createPageSelector.push(<button><Link to={`/reviews/${pageNumber + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;</Link></button>);
            createPageSelector.push(<button><Link to={`/reviews/${pageAmount}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;&#62;</Link></button>);
        }

        setPageReviews(createPageReviews);
        setPageSelector(createPageSelector);
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    return (
        <>
            <div className={reviewsPageStyle.main}>
                <div className={ `${reviewsPageStyle.backgroundImage} center`}>
                    <h2 className={ `${reviewsPageStyle.text} ${reviewsPageStyle.h2}` }>Find the best places to visit</h2>
                    <p className={reviewsPageStyle.text}>Writing a travel review helps ensure that future travelers select the right destination and accommodations for them.</p>
                </div>
                
                <div className={ `${reviewsPageStyle.gallery} center`}>
                    <h2 class="cell" style={{ marginTop:"50px" }}>Reviews</h2>
                    <h3 style={{ textAlign:"center" }}>Read reviews people leave about different places you can travel to.</h3>
                </div>

                <div className={ `${reviewsPageStyle.gallery} center ${reviewsPageStyle.rowButtons}`}>
                    <h3 class="cell grow" style={{ marginTop:"50px" }} onClick={() => { window.open("/reviews/1", "_self"); }}>All Reviews</h3>
                    <h3 class="cell grow" style={{ marginTop:"50px" }} onClick={() => { window.open("/reviews/my/1", "_self"); }}>My Reviews</h3>
                </div>
                
                <div className={ `${reviewsPageStyle.gallery} center ${reviewsPageStyle.pageSelector}`} style={{ marginTop: "100px" }}>
                    {pageSelector}
                </div>

                <div className={ `${reviewsPageStyle.gallery} ${reviewsPageStyle.reviewsGrid} center`}>
                    {pageReviews}
                </div>

                <div className={ `${reviewsPageStyle.gallery} center ${reviewsPageStyle.pageSelector}`} style={{ marginBottom: "100px" }}>
                    {pageSelector}
                </div>
            </div>
        </>
    );
};

export default MyReviewsPage;