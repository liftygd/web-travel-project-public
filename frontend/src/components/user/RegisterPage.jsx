import React, { useState, useEffect } from 'react';

import UserRegister from "./UserRegister";

import "../../main.css";
import "./UserAuthStyle.css";

const RegisterPage = () => {
    return (
        <>
            <div class="backgroundImage center">
                <UserRegister />
            </div>
        </>
    );
};

export default RegisterPage;