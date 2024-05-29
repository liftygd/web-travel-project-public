import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import "../../../main.css";
import "../UserAuthStyle.css";

const ForgotResetUsernamePage = () => {
    let { email } = useParams();
    let { token } = useParams();

    function resetUsername(email, userName, emailToken) {
        axios.post(`BACKEND_ADDRESS/resetUsername`, { userName: userName, email: email, emailToken: token })
            .then(response => {
                const responseStatus = response.data.status;
                if (responseStatus == 'okay'){
                    window.open("/login/forgot/complete", "_self");
                }
                else {
                    setError("Invalid reset token.");
                }
            });
    }

    const [input, setInput] = useState([{
        userName: ''
    }]);
    const [error, setError] = useState([""]);
    const [success, setSuccess] = useState([""]);

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


    async function handleClick(event) {
        event.preventDefault();
        const newUser = {
            userName: input.userName
        };

        if (newUser.userName === undefined || newUser.userName === ''){
            setError("Username is empty");
            return;
        }

        const userName = await axios.get(`BACKEND_ADDRESS/userByName/${newUser.userName}`);
        if (userName.data) {
            setError("Username is already taken");
            return;
        }

        resetUsername(email, newUser.userName, token);
    }

    return (
        <>
            <div class="backgroundImage center">
                <div class="centerDiv panelBG" id="loginBox">
                    <div class="authBox">
                        <h1>Input your new username</h1>
                        <h3 class="errorMessage">{error}</h3>
                        <input name="userName" value={input.userName} placeholder='New username' onChange={handleChange}></input>
                        <button onClick={handleClick}>Reset username</button>

                        <h3 class="errorMessage" style={{ color:"green" }}>{success}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotResetUsernamePage;