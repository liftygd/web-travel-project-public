import React, { useState, useEffect } from 'react';

import "../../main.css";
import routeStyles from "./RouteStyle.module.css";

import NewImage from "../../images/reviews/review_new.svg";

const RouteCreateHeader = () => {
    return (
        <>
            <div className={routeStyles.reviewCell} style={{ backgroundColor: "#ffffff7d", alignItems: "center", justifyItems: "center" }}>
                <img src={NewImage} style={{ gridRow: "1/4", gridColumn: "1/4", boxSizing: "border-box", padding: "50px" }} class="grow" onClick={() => window.open("/routes/create", "_self")}></img>
            </div>
        </>
    );
};

export default RouteCreateHeader;