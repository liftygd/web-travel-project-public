import React, { useState, useEffect } from 'react';

import UserLogin from "./UserLogin";

import "../../main.css";
import "./UserAuthStyle.css";

const LoginPage = () => {
    return (
        <>
            <div class="backgroundImage center">
                <UserLogin />
            </div>
        </>
    );
};

export default LoginPage;