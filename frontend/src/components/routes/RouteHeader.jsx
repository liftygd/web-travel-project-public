import React, { useState, useEffect } from 'react';

import "../../main.css";
import routeStyles from "./RouteStyle.module.css";

import Map from './Map';

const RouteHeader = (props) => {
    return (
        <>
            <div className={routeStyles.reviewCell}>
                <div className={routeStyles.text}>
                    <h2>{props.title}</h2>
                    <h3 className={routeStyles.publishDate}>{props.publishDate} | User Score: {props.userScore}</h3>
                    <h3 className={routeStyles.publishDate}>{props.points[0].title} - {props.points[props.points.length - 1].title}</h3>
                </div>

                <div className={routeStyles.reviewImage}>
                    <Map 
                        points={props.points}
                        zoom={4}
                    />
                </div>

                <div className={routeStyles.descriptionText}>
                    <p>{props.desc}</p>
                </div>
                
                <div className={routeStyles.buttons}>
                    <button className={ `${routeStyles.reviewButton} grow` } onClick={() => window.open(`/routes/read/${props.routeId}/1`, "_self")}>Open route</button>
                    
                        {props.canEdit ?
                        <button className={ `${routeStyles.reviewButton} grow`} onClick={() => window.open(`/routes/edit/${props.routeId}`, "_self")}>Edit route</button>
                        
                        :

                        <div></div>
                        }
                </div>
            </div>
        </>
    );
};

export default RouteHeader;