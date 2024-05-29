import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import "./UserAuthStyle.css";
import "../../main.css";

const UserRegister = () => {
    const [input, setInput] = useState([{
        userName: '',
        email: '',
        password: '',
        passwordConfirm: ''
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

    function turnLogIn(){
        const register = document.getElementById('registrationBox');
        register.style.visibility = "hidden";

        setInput({userName: '', password: ''});
        setError("");

        const login = document.getElementById('loginBox');
        login.style.visibility = "visible";
    }

    async function handleClick(event) {
        event.preventDefault();
        const newUser = {
            userName: input.userName,
            email: input.email,
            password: input.password,
            passwordConfirm: input.passwordConfirm
        };

        if (newUser.userName === undefined || newUser.userName === ''){
            setError("Enter your username");
            return;
        }
        
        const userName = await axios.get(`BACKEND_ADDRESS/userByName/${newUser.userName}`);
        if (userName.data) {
            setError("Username is already taken");
            return;
        }

        if (newUser.email === undefined || newUser.email === ''){
            setError("Enter your email");
            return;
        }

        const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValidate.test(newUser.email)){
            setError("Invalid email");
            return;
        }

        const userEmail = await axios.get(`BACKEND_ADDRESS/userByEmail/${newUser.email}`);
        if (userEmail.data) {
            setError("Email is already taken");
            return;
        }

        if (newUser.password === undefined || newUser.password === ''){
            setError("Enter your password");
            return;
        }

        if (newUser.password !== newUser.passwordConfirm){
            setError("Password not confirmed");
            return;
        }

        axios.post(`BACKEND_ADDRESS/register`, newUser);
        //localStorage.setItem('user', JSON.stringify(newUser));

        window.open("/register/verify", "_self");
    }

    return (
        <div class="centerDiv panelBG" id="registrationBox">
            <div class="authBox">
                <h1>Create an account</h1>
                <h3 class="errorMessage">{error}</h3>
                <input name="userName" value={input.userName} placeholder='Username *' onChange={handleChange}></input>
                <input name="email" type="email" value={input.emauk} placeholder='Email *' onChange={handleChange}></input>
                <input name="password" type="password" value={input.password} placeholder='Password *' onChange={handleChange}></input>
                <input name="passwordConfirm" type="password" value={input.passwordConfirm} placeholder='Confirm Password *' onChange={handleChange}></input>

                <button onClick={handleClick}>Sign Up</button>

                <p>Or <span class="fakeLink"><Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit' }}>sign in</Link></span> if you already have an account</p>
            </div>
        </div>
    );
};

export default UserRegister;