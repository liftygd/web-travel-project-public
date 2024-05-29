import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import "../../main.css";
import routeStyles from "./RouteStyle.module.css";
import routeReadStyle from "./RouteChangeStyle.module.css";

import moment from 'moment';
import Map from "./Map.jsx";

const RouteCreateNewPage = () => {
    const [input, setInput] = useState([{
        title: '',
        description: '',
    }]);
    const [error, setError] = useState([""]);
    let [ points, setPoints ] = useState([]);
    let [ zoom, setZoom ] = useState(1);
    let [ pageReviews, setPageReviews ] = useState([]);
    let [ updateMap, setUpdateMap ] = useState(false);

    async function loadReviews() {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        const loadedReviews = (await axios.get(`BACKEND_ADDRESS/reviews/byUser/${foundUser._id}`)).data;
        setPageReviews(loadedReviews);
    }

    useEffect(() => {
        loadReviews();

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

    function handlePointChange(event) {
        setError("");
        const {name, value} = event.target;
        const splitName = name.split("_");

        let tempArr = [...points];
        if (splitName[0] == "date") {
            tempArr[parseInt(splitName[1])][splitName[0]] = Date.parse(value);
        }
        else {
            tempArr[parseInt(splitName[1])][splitName[0]] = value;
        }

        setPoints([...tempArr]);
    }

    function handlePoints(pointsArray, zoom) {
        setPoints([...pointsArray]);
        setZoom(zoom);
    }

    async function createReview(event) {
        event.preventDefault();

        const loggedInUser = localStorage.getItem('user');
        const foundUser = JSON.parse(loggedInUser);

        const newRoute = {
            title: input.title,
            description: input.description,
            isPublished: document.getElementById("isPublished").checked,
            userID: foundUser._id,
            publishDate: Date.now(),
            pointsArray: points
        };

        if (newRoute.title === undefined || newRoute.title === '') {
            setError("* Title is empty");
            return;
        }

        if (newRoute.description === undefined || newRoute.description === '') {
            setError("* Description is empty");
            return;
        }

        axios.post(`BACKEND_ADDRESS/routes/add`, newRoute);

        //window.open("/routes/my/1", "_self");
    }

    function removePoint(event, index) {
        let tempArr = ([...points]);
        tempArr.splice(index, 1);

        setPoints([...tempArr]);
        setUpdateMap(!updateMap);
    }

    function moveUpPoint(event, index) {
        let tempArr = ([...points]);
        if (index <= 0) return;

        const tempElem = tempArr[index - 1];
        tempArr[index - 1] = tempArr[index];
        tempArr[index] = tempElem;

        setPoints([...tempArr]);
        setUpdateMap(!updateMap);
    }

    function moveDownPoint(event, index) {
        let tempArr = ([...points]);
        if (index >= tempArr.length - 1) return;

        const tempElem = tempArr[index + 1];
        tempArr[index + 1] = tempArr[index];
        tempArr[index] = tempElem;

        setPoints([...tempArr]);
        setUpdateMap(!updateMap);
    }

    return (
        <>
            <div className={routeStyles.main}>
                <div className={ `${routeStyles.gallery} center`}>
                    <h2 class="cell" style={{ marginTop:"50px" }}>New Route</h2>
                </div>

                <div className={ `${routeStyles.gallery} center`}>
                    <div className={ `${routeStyles.reviewReadContainer}`}>
                        <textarea id="tInput" name="title" placeholder='Title' rows="1" maxLength="109" value={input.title} onChange={handleChange}></textarea>
                        <textarea id="dInput" name="description"  placeholder='Full Description' rows="10" maxLength="1090" value={input.description} onChange={handleChange}></textarea>
                    
                                            
                        <h2>Publish after creation?</h2>
                        <label className={`${routeStyles.scoreArea}`}>
                            <input type="checkbox" id="isPublished" name="isPublished"></input>
                            <span>Public</span>
                        </label>
                    </div>

                    <div className={ `${routeReadStyle.routeContainer}`}>
                        <div className={ `${routeReadStyle.routePoints}`}>
                            {points.map((point, index) =>
                                <div className={ `${routeReadStyle.cell}`}>
                                    <fieldset className={ `${routeReadStyle.buttonField}`}>
                                        <legend>Point controller:</legend>

                                        <button class="grow" onClick={(e) => moveUpPoint(e, index)}>Move Up</button>
                                        <button class="grow" onClick={(e) => moveDownPoint(e, index)}>Move Down</button>
                                        <button class="grow" onClick={(e) => removePoint(e, index)}>Delete</button>
                                    </fieldset>
                                    <br></br><br></br>

                                    <textarea id="pointTitleInput" name={`title_${index}`} placeholder='Title' rows="1" maxLength="50" value={point.title} onChange={handlePointChange}></textarea>
                                
                                    <h3 className={routeStyles.publishDate}></h3>
                                    <input className={routeStyles.publishDate} type="date" id="pointDateInput" name={`date_${index}`} value={moment(new Date(point.date)).format("YYYY-MM-DD")} onChange={handlePointChange}></input>
                                    <h3 className={routeStyles.publishDate}>lat: {point.latitude.toFixed(5)} - lng: {point.longitude.toFixed(5)}</h3>

                                    <textarea id="pointDescriptionInput" name={`description_${index}`}  placeholder='Description' rows="5" maxLength="545" value={point.description} onChange={handlePointChange}></textarea>

                                    <h3 className={routeStyles.publishDate}></h3>
                                    <fieldset className={ `${routeReadStyle.radioField}`}>
                                        <legend>Select transport mode:</legend>

                                        <label>
                                            <input type="radio" id="walk" name={`transportMode_${index}`} value='Walk' defaultChecked={point.transportMode == "Walk"} onChange={handlePointChange}></input>
                                            <span>Walk</span>
                                        </label>
                                        <label>
                                            <input type="radio" id="car" name={`transportMode_${index}`} value='Car' defaultChecked={point.transportMode == "Car"} onChange={handlePointChange}></input>
                                            <span>Car</span>
                                        </label>
                                        <label>
                                            <input type="radio" id="bus" name={`transportMode_${index}`} value='Bus' defaultChecked={point.transportMode == "Bus"} onChange={handlePointChange}></input>
                                            <span>Bus</span>
                                        </label>
                                        <label>
                                            <input type="radio" id="train" name={`transportMode_${index}`} value='Train' defaultChecked={point.transportMode == "Train"} onChange={handlePointChange}></input>
                                            <span>Train</span>
                                        </label>
                                        <label>
                                            <input type="radio" id="plane" name={`transportMode_${index}`} value='Plane' defaultChecked={point.transportMode == "Plane"} onChange={handlePointChange}></input>
                                            <span>Plane</span>
                                        </label>
                                        <label>
                                            <input type="radio" id="ship" name={`transportMode_${index}`} value='Ship' defaultChecked={point.transportMode == "Ship"} onChange={handlePointChange}></input>
                                            <span>Ship</span>
                                        </label>
                                    </fieldset>

                                    <h3 className={routeStyles.publishDate}></h3>
                                    <fieldset className={ `${routeReadStyle.radioField}`}>
                                        <legend>Link a review:</legend>

                                        <select name={`linkedReview_${index}`} id="pointSelectReview" value={point.linkedReview} onChange={handlePointChange}>
                                            <option value="">None</option>
                                            {pageReviews.map((review) => 
                                                <option value={review._id}>{review.title}</option>
                                            )}
                                        </select>
                                    </fieldset>
                                </div>
                            )}
                        </div>

                        <div className={ `${routeReadStyle.routeMap}`}>
                            <Map 
                                key={points}
                                points={points}
                                canEdit={true}
                                zoom={zoom}
                                update={updateMap}
                                onPointsChange={handlePoints}
                            />
                        </div>
                    </div>

                    <h2 style={{ color:"red" }}>{error}</h2>

                    <div className={`${routeStyles.createButtonContainer}`}>
                        <button className={`${routeStyles.createButton} cell grow`} onClick={createReview}>Create Route</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RouteCreateNewPage;