import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import "./UserAuthStyle.css";
import "../../main.css";

const UserLogin = () => {
    const [input, setInput] = useState([{
        email: '',
        password: '',
        userID: ''
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
            email: input.email,
            password: input.password
        };

        if (newUser.email === undefined || newUser.email === ''){
            setError("Email is empty");
            return;
        }

        if (newUser.password === undefined || newUser.password === ''){
            setError("Password is empty");
            return;
        }

        const user = await axios.get(`BACKEND_ADDRESS/userByEmail/${newUser.email}`);
        const userExists = user.data;

        if (!userExists) {
            setError("Wrong email or password");
            return;
        }

        if (!user.data.confirmedEmail) {
            setError("User email has not been verified yet.");
            return;
        }

        const rightPassword = await axios.get(`BACKEND_ADDRESS/users/verify/${newUser.email}&${newUser.password}`);

        if (!rightPassword.data) {
            setError("Wrong email or password");
            return;
        }

        localStorage.setItem('user', JSON.stringify(user.data));

        window.open("/", "_self");
    }

    return (
        <div class="centerDiv panelBG" id="loginBox">
            <div class="authBox">
                <h1>Welcome!</h1>
                <h3 class="errorMessage">{error}</h3>
                <input name="email" type="email" value={input.email} placeholder='Email' onChange={handleChange}></input>
                <input name="password" type="password" value={input.password} placeholder='Password' onChange={handleChange}></input>
                <h4 class="forgotLink fakeLink"><Link to="/login/forgot" style={{ color: 'inherit', textDecoration: 'inherit' }}>Forgot password?</Link></h4>
                <button onClick={handleClick}>Sign in</button>

                <p>Or <span class="fakeLink"><Link to="/register" style={{ color: 'inherit', textDecoration: 'inherit' }}>sing up</Link></span> if you do not have an account</p>
            </div>
        </div>
    );
};

export default UserLogin;