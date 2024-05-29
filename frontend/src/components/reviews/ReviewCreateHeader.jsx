import React, { useState, useEffect } from 'react';

import "../../main.css";
import reviewStyles from "./ReviewStyle.module.css";

import ReviewNewImage from "../../images/reviews/review_new.svg";

const ReviewCreateHeader = () => {
    return (
        <>
            <div className={reviewStyles.reviewCell} style={{ backgroundColor: "#ffffff7d", alignItems: "center", justifyItems: "center" }}>
                <img src={ReviewNewImage} style={{ gridRow: "1/4", width: "50%" }} class="grow" onClick={() => window.open("/reviews/create", "_self")}></img>
            </div>
        </>
    );
};

export default ReviewCreateHeader;