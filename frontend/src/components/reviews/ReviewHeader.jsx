import React, { useState, useEffect } from 'react';

import "../../main.css";
import reviewStyles from "./ReviewStyle.module.css";

const ReviewHeader = (props) => {
    return (
        <>
            <div className={reviewStyles.reviewCell}>
                <div className={reviewStyles.reviewImage}>
                    <img src={props.image}></img>
                </div>

                <div className={reviewStyles.text}>
                    <h2>{props.title}</h2>
                    <h3 className={reviewStyles.publishDate}>{props.publishDate}</h3>
                    <h3 className={reviewStyles.publishDate}>User Score: {props.userScore}</h3>

                    <p>{props.shortDesc}</p>
                </div>
                
                <div className={reviewStyles.buttons}>
                    <button className={ `${reviewStyles.reviewButton} grow` } onClick={() => window.open(`/reviews/read/${props.reviewId}/1`, "_self")}>Read full review</button>
                    
                        {props.canEdit ?
                        <button className={ `${reviewStyles.reviewButton} grow`} onClick={() => window.open(`/reviews/edit/${props.reviewId}`, "_self")}>Edit review</button>
                        
                        :

                        <div></div>
                        }
                </div>
            </div>
        </>
    );
};

export default ReviewHeader;