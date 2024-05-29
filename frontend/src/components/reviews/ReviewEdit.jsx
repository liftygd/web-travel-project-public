import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import "../../main.css";
import reviewStyles from "./ReviewStyle.module.css";

import StarEmptyImage from "../../images/reviews/star_empty.svg";
import StarFullImage from "../../images/reviews/star_full.svg";

const ReviewEditPage = () => {
    const [input, setInput] = useState([{
        title: '',
        shortDescription: '',
        description: ''
    }]);
    const [error, setError] = useState([""]);
    const [success, setSuccess] = useState([""]);

    const [canEdit, setCanEdit] = useState(true);
    const { reviewID } = useParams();

    useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          return "";
        };
      
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

    window.onload = async function loadData() {
        document.getElementById("container").style.visibility = "hidden";
        const review = await axios.get(`BACKEND_ADDRESS/reviews/byID/${reviewID}`);
    
        if (!review.data) { 
            setCanEdit(false);
            return; 
        }
    
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            setCanEdit(false);
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        if (foundUser._id !== review.data.userID) {
            setCanEdit(false);
            return;
        }

        setInput({ title: review.data.title, shortDescription: review.data.shortDescription, description: review.data.description });

        setStars(review.data.stars);
        updateStars(review.data.stars);

        document.getElementById("container").style.visibility = "visible";
        document.getElementById("isPublished").checked = review.data.isPublished;
    }

    function handleChange(event) {
        setError("");
        setSuccess("");
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
        updateStars(event.currentTarget.value);
    }

    function updateStars(value) {
        let newArr = [...starStates];

        for (let i = 0; i < 5; i++) {
            if (newArr[i].id <= value){
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
            id: reviewID,
            title: input.title,
            shortDescription: input.shortDescription,
            description: input.description,
            isPublished: document.getElementById("isPublished").checked,
            userID: foundUser.userID,
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

        if (imagefile.files.length >= 0)
            formData.append("image", imagefile.files[0]);
        else 
            formData.append("image", null);

        Object.entries(newReview).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              // used stringify but might also just use join() for comma separated string
              v = JSON.stringify(v);
            }
            formData.append(k, v);
        });

        axios.post('/reviews/edit', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });

        setSuccess("Review successfuly saved!");
    }

    function checkImageSize() {
        setError("");
        setSuccess("");
        var imagefile = document.querySelector('#file');

        if(imagefile.files[0].size > 4194304) {
            setError("* Max image size: 4MB");
            imagefile.value = "";
        }
    }

    return (
        <>
            {!canEdit ? <div></div> :
            <div className={reviewStyles.main} id="container">
                <div className={ `${reviewStyles.gallery} center`}>
                    <h2 class="cell" style={{ marginTop:"50px" }}>Edit Review</h2>
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
                        <h3 style={{ color:"green" }}>{success}</h3>

                        <div className={`${reviewStyles.createButtonContainer}`}>
                            <button className={`${reviewStyles.createButton} cell grow`} onClick={createReview}>Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
};

export default ReviewEditPage;