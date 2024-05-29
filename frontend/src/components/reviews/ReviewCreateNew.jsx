import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import "../../main.css";
import reviewStyles from "./ReviewStyle.module.css";

import StarEmptyImage from "../../images/reviews/star_empty.svg";
import StarFullImage from "../../images/reviews/star_full.svg";

const ReviewCreateNewPage = () => {
    const [input, setInput] = useState([{
        title: '',
        shortDescription: '',
        description: '',
        isPublished: false,
        userID: '',
        publishDate: 0,
        stars: 0
    }]);
    const [error, setError] = useState([""]);

    useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          return "";
        };
      
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

    function handleChange(event) {
        setError("");
        const {name, value} = event.target;

        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        });
    }
    
    const [stars, setStars] = useState(1);
    const [starStates, setStarStates] = useState([
        { id:1, value: StarFullImage },
        { id:2, value: StarEmptyImage },
        { id:3, value: StarEmptyImage },
        { id:4, value: StarEmptyImage },
        { id:5, value: StarEmptyImage }
    ]);

    function handleStars(event) {
        setStars(event.currentTarget.value);
        let newArr = [...starStates];

        for (let i = 0; i < 5; i++) {
            if (newArr[i].id <= event.currentTarget.value){
                newArr[i].value = StarFullImage;
            }
            else {
                newArr[i].value = StarEmptyImage;
            }
        }

        setStarStates(newArr);
    }

    async function createReview(event) {
        event.preventDefault();

        const loggedInUser = localStorage.getItem('user');
        const foundUser = JSON.parse(loggedInUser);

        const newReview = {
            title: input.title,
            shortDescription: input.shortDescription,
            description: input.description,
            isPublished: document.getElementById("isPublished").checked,
            userID: foundUser._id,
            publishDate: Date.now(),
            stars: stars
        };

        if (newReview.title === undefined || newReview.title === '') {
            setError("* Title is empty");
            return;
        }

        if (newReview.shortDescription === undefined || newReview.shortDescription === '') {
            setError("* Short description is empty");
            return;
        }

        if (newReview.description === undefined || newReview.description === '') {
            setError("* Description is empty");
            return;
        }

        var formData = new FormData();
        var imagefile = document.querySelector('#file');
        if (imagefile.files.length <= 0) {
            setError("* Select an image");
            return;
        }

        formData.append("image", imagefile.files[0]);

        Object.entries(newReview).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              // used stringify but might also just use join() for comma separated string
              v = JSON.stringify(v);
            }
            formData.append(k, v);
        });

        axios.post(`BACKEND_ADDRESS/reviews/add`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });

        window.open("/reviews/my/1", "_self");
    }

    function checkImageSize() {
        setError("");
        var imagefile = document.querySelector('#file');

        if(imagefile.files[0].size > 4194304) {
            setError("* Max image size: 4MB");
            imagefile.value = "";
        }
    }

    return (
        <>
            <div className={reviewStyles.main}>
                <div className={ `${reviewStyles.gallery} center`}>
                    <h2 class="cell" style={{ marginTop:"50px" }}>New Review</h2>
                </div>

                <div className={ `${reviewStyles.gallery} center`}>
                    <div className={ `${reviewStyles.reviewContainer}`}>
                        <textarea id="tInput" name="title" placeholder='Title' rows="1" maxLength="109" value={input.title} onChange={handleChange}></textarea>
                        <textarea id="sDInput" name="shortDescription" placeholder='Short Description' maxLength="218" value={input.shortDescription} onChange={handleChange}></textarea>
                        <textarea id="dInput" name="description"  placeholder='Full Description' rows="20" maxLength="2180" value={input.description} onChange={handleChange}></textarea>
                        
                        <h2>Picture</h2>
                        <form id="uploadForm" enctype="multipart/form-data" onChange={checkImageSize}>
                            <input type="file" id="file" name="file" accept="image/*" className={ `${reviewStyles.imageChoose}`}></input>
                        </form>

                        <h2>Score</h2>
                        <div className={`${reviewStyles.scoreArea}`}>
                            {starStates.map((localState, index) => (
                                <button className={`grow`} onClick={handleStars} value={localState.id}><img src={localState.value}></img></button>
                            ))}
                        </div>
                        
                        <h2>Publish after creation?</h2>
                        <label className={`${reviewStyles.scoreArea}`}>
                            <input type="checkbox" id="isPublished" name="isPublished"></input>
                            <span>Public</span>
                        </label>

                        <h2 style={{ color:"red" }}>{error}</h2>

                        <div className={`${reviewStyles.createButtonContainer}`}>
                            <button className={`${reviewStyles.createButton} cell grow`} onClick={createReview}>Create Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewCreateNewPage;