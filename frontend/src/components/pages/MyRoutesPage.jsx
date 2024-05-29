import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import RouteHeader from '../routes/RouteHeader';
import RouteCreateHeader from '../routes/RouteCreateHeader';

import "../../main.css";
import routesPageStyles from "./RoutesPageStyle.module.css";

import moment from 'moment';

const MyRoutesPage = () => {
    let { pageNumber } = useParams();
    let [ pageSelector, setPageSelector ] = useState([]);
    let [ pageRoutes, setPageRoutes ] = useState([]);

    pageNumber = parseInt(pageNumber, 10);

    useEffect(()=>{
        loadRoutes()
    }, []);

    async function loadRoutes() {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        const loadedRoutes = (await axios.get(`BACKEND_ADDRESS/routes/byUser/${foundUser._id}`)).data;

        let createPageSelector = [];
        let createPageRoutes = [];

        createPageRoutes.push(<RouteCreateHeader />);

        //Page reviews
        for (let i = (pageNumber - 1) * 12; i < pageNumber * 12; i++) {
            if (i >= loadedRoutes.length) break;

            const routeData = loadedRoutes[i];

            const base64Flag = 'data:image/jpeg;base64,';
            const imageStr = '';
            //const imageStr = arrayBufferToBase64(routeData.reviewImage.data.data);

            createPageRoutes.push(<RouteHeader 
                title={routeData.title}
                publishDate={routeData.isPublished ? `${moment(new Date(routeData.publishDate)).format("MMM Do YYYY")} | Travel points: ${routeData.pointsArray.length}` : "Not published"}
                points={routeData.pointsArray}
                desc={routeData.description}
                userScore={routeData.userScore}
                image={base64Flag + imageStr}
                canEdit={true}
                routeId={routeData._id}
            />);
        }

        const pageAmount = Math.ceil(createPageRoutes.length / 12);
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
                createPageSelector.push(<button className={routesPageStyles.selectedPageButton}><Link to={`/reviews/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
            else
                createPageSelector.push(<button><Link to={`/reviews/${i + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>{i + 1}</Link></button>);
        }

        if (pageNumber + pageDiff < pageAmount) createPageSelector.push(<button>...</button>);
        if (pageNumber < pageAmount) {
            createPageSelector.push(<button><Link to={`/reviews/${pageNumber + 1}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;</Link></button>);
            createPageSelector.push(<button><Link to={`/reviews/${pageAmount}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>&#62;&#62;</Link></button>);
        }

        setPageRoutes(createPageRoutes);
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
            <div className={routesPageStyles.main}>
                <div className={ `${routesPageStyles.backgroundImage} center`}>
                    <h2 className={ `${routesPageStyles.text} ${routesPageStyles.h2}` }>Share your travelling journey</h2>
                    <p className={routesPageStyles.text}>It's a new landscape, a foreign language, a different culture and new people. You'll never be more exposed to new things.</p>
                </div>
                
                <div className={ `${routesPageStyles.gallery} center`}>
                    <h2 class="cell" style={{ marginTop:"50px" }}>Routes</h2>
                    <h3 style={{ textAlign:"center" }}>Find adventures to go on or share your perfect journey.</h3>
                </div>

                <div className={ `${routesPageStyles.gallery} center ${routesPageStyles.rowButtons}`}>
                    <h3 class="cell grow" style={{ marginTop:"50px" }} onClick={() => { window.open("/routes/1", "_self"); }}>All Routes</h3>
                    <h3 class="cell grow" style={{ marginTop:"50px" }} onClick={() => { window.open("/routes/my/1", "_self"); }}>My Routes</h3>
                </div>
                
                <div className={ `${routesPageStyles.gallery} center ${routesPageStyles.pageSelector}`} style={{ marginTop: "100px" }}>
                    {pageSelector}
                </div>

                <div className={ `${routesPageStyles.gallery} ${routesPageStyles.reviewsGrid} center`}>
                    {pageRoutes}
                </div>

                <div className={ `${routesPageStyles.gallery} center ${routesPageStyles.pageSelector}`} style={{ marginBottom: "100px" }}>
                    {pageSelector}
                </div>
            </div>
        </>
    );
};

export default MyRoutesPage;