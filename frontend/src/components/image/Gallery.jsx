import React, { useState, useEffect } from 'react';

import "../../main.css";
import "./GalleryStyle.css";

const Gallery = (props) => {
    return (
        <>
            <div class="galleryContainer">
                <div class="galleryImage">
                    <img src={props.image}></img>
                </div>

                <div class="galleryTitle">
                    <h2> {props.title} </h2>
                </div>

                <div class="galleryDescription">
                    <p> {props.description} </p>
                </div>
            </div>
        </>
    );
};

export default Gallery;