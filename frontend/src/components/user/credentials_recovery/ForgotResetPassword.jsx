import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import "../../../main.css";
import "../UserAuthStyle.css";

const ForgotResetPasswordPage = () => {
    let { email } = useParams();
    let { token } = useParams();

    function resetPassword(email, password, emailToken) {
        axios.post(`BACKEND_ADDRESS/resetPassword`, { password: password, email: email, emailToken: token })
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
        password: '',
        passwordConfirm: ''
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
            password: input.password,
            passwordConfirm: input.passwordConfirm
        };

        if (newUser.password === undefined || newUser.password === ''){
            setError("Password is empty");
            return;
        }

        if (newUser.password !== newUser.passwordConfirm){
            setError("Password not confirmed");
            return;
        }

        resetPassword(email, newUser.password, token);
    }

    return (
        <>
            <div class="backgroundImage center">
                <div class="centerDiv panelBG" id="loginBox">
                    <div class="authBox">
                        <h1>Input your new password</h1>
                        <h3 class="errorMessage">{error}</h3>
                        <input name="password" type="password" value={input.password} placeholder='Password' onChange={handleChange}></input>
                        <input name="passwordConfirm" type="password" value={input.passwordConfirm} placeholder='Confirm Password' onChange={handleChange}></input>
                        <button onClick={handleClick}>Reset password</button>

                        <h3 class="errorMessage" style={{ color:"green" }}>{success}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotResetPasswordPage;