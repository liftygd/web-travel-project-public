import React, { useState, useEffect } from 'react';

import "../../main.css";
import "./UserAuthStyle.css";

const EmailVerificationSendPage = () => {
    return (
        <>
            <div class="backgroundImage center">
                <div class="verificationBox">
                    <h2>Email verification link has been sent to your email! </h2>
                    <p>From travellers.hut@mail.ru. Check the spam folder if you cannot find it.</p>
                </div>
            </div>
        </>
    );
};

export default EmailVerificationSendPage;