import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import "../UserAuthStyle.css";
import "../../../main.css";

const ForgotChoice = () => {
    let { email } = useParams();

    resetPassword();

    function resetUsername() {
        axios.post(`BACKEND_ADDRESS/sendResetUsername`, { email: email });

        window.open(window.location.href + "/sent", "_self");
    }

    function resetPassword() {
        axios.post(`BACKEND_ADDRESS/sendResetPassword`, { email: email });

        window.open(window.location.href + "/sent", "_self");
    }

    return (
        <div class="backgroundImage center">
            <div class="centerDiv panelBG" id="loginBox">
                <div class="verificationBox">
                    <h2>Choose what you want to reset</h2>
                    <button onClick={resetUsername}>Username</button>
                    <button onClick={resetPassword}>Password</button>
                </div>
            </div>
        </div>
    );
};

export default ForgotChoice;