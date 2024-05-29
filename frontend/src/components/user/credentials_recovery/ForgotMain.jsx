import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import "../UserAuthStyle.css";
import "../../../main.css";

const ForgotMain = () => {
    const [input, setInput] = useState([{
        email: ''
    }]);
    const [error, setError] = useState([""]);

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


    async function handleClick(event) {
        event.preventDefault();
        const newUser = {
            userName: "test",
            email: input.email
        };

        if (newUser.email === undefined || newUser.email === ''){
            setError("Field is empty");
            return;
        }

        const user = await axios.get(`BACKEND_ADDRESS/userByEmail/${newUser.email}`);
        const userExists = user.data;

        if (!userExists) {
            setError("Unable to find user with this email.");
            return;
        }

        if (!user.data.confirmedEmail) {
            setError("User email has not been verified yet.");
            return;
        }

        window.open(`/login/forgot/${newUser.email}`, "_self");
    }

    return (
        <div class="backgroundImage center">
            <div class="centerDiv panelBG" id="loginBox">
                <div class="verificationBox">
                    <h2>Please enter your email address</h2>
                    <h3 class="errorMessage">{error}</h3>
                    <input name="email" value={input.email} placeholder='Email' type="email" onChange={handleChange}></input>
                    <button onClick={handleClick}>Continue</button>
                </div>
            </div>
        </div>
    );
};

export default ForgotMain;