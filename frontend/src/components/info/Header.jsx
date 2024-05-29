import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import "../../main.css";
import "./HeaderStyle.css";

import ProfileLogo from "../../images/profile.svg";
import ProfileLogOutLogo from "../../images/logout.svg";
import PlanetLogo from "../../images/planet.svg";
import MenuLogo from "../../images/menulogo.svg";
import MenuClose from "../../images/menuclose.svg";

const Header = () => {
    const [user, setUser] = useState([{
        userName: '',
        password: '',
        userId: ''
    }]);
    const [profileImage, setImage] = useState(
        ProfileLogo
    );
    const [menuImage, setMenuImage] = useState(
        MenuLogo
    );

    function userAuth() {
        if (user.userName !== undefined) {
            setUser({});
            setImage(ProfileLogo);
            localStorage.removeItem('user');

            window.open("/", "_self");

            return;
        }

        window.open('/login', "_self");
        //const register = document.getElementById('loginBox');
        //register.style.visibility = "visible";
    }

    function handleMenu() {
        const menu = document.getElementById('headerMenu');

        if (menu.style.height == "0px" || menu.style.height == ""){
            menu.style.height = "100%";
            setMenuImage(MenuClose);
        }
        else {
            menu.style.height = "0px";
            setMenuImage(MenuLogo);
        }
    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            setImage(ProfileLogo);
            return;
        }

        const foundUser = JSON.parse(loggedInUser);
        setUser(foundUser);
        setImage(ProfileLogOutLogo);
    }, []);

    return (
        <>
            <div class="header" id="fullHeader">
                <div class="headerLogo">
                    <img src={PlanetLogo} alt="profile"></img>
                    <h2 class="noSelect">TRAVELLER'S HUT</h2>
                </div>

                <div class="headerNavigation">
                    <h2 class="grow noSelect"><Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>Главная</Link></h2>
                    <h2 class="grow noSelect"><Link to="/reviews/1" style={{ color: 'inherit', textDecoration: 'inherit' }}>Обзоры</Link></h2>
                    <h2 class="grow noSelect"><Link to="/routes/1" style={{ color: 'inherit', textDecoration: 'inherit' }}>Маршруты</Link></h2>

                    <h2 class="noSelect" id="userProfileName">{user.userName}</h2>
                    <button class="imageButton" id="userProfileButton" onClick={userAuth}>
                        <img class="grow" src={profileImage} alt="profile"></img>
                    </button>
                </div>
            </div>

            <div class="header" id="mediumHeader">
                <button class="imageButton" id="menuButton" onClick={handleMenu}>
                    <img class="grow" src={menuImage} alt="profile"></img>
                </button>

                <div class="headerLogo center">
                    <img src={PlanetLogo} alt="profile"></img>
                    <h2 class="noSelect">TRAVELLER'S HUT</h2>
                </div>
            </div>

            <div id="headerMenu">
                <div class="headerNavigation menuContainer">
                    <h2 class="grow noSelect"><Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>Главная</Link></h2>
                    <h2 class="grow noSelect"><Link to="/reviews/1" style={{ color: 'inherit', textDecoration: 'inherit' }}>Обзоры</Link></h2>
                    <h2 class="grow noSelect"><Link to="/routes/1" style={{ color: 'inherit', textDecoration: 'inherit' }}>Маршруты</Link></h2>

                    <h2 class="noSelect" id="userProfileName">{user.userName}</h2>
                    <button class="imageButton" id="userProfileButton" onClick={userAuth}>
                        <img class="grow" src={profileImage} alt="profile"></img>
                    </button>
                </div>
            </div>

            
        </>
    );
};

export default Header;