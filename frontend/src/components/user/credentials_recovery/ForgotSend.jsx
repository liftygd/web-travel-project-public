import React, { useState, useEffect } from 'react';

import "../../../main.css";
import "../UserAuthStyle.css";

const ForgotSendPage = () => {
    return (
        <>
            <div class="backgroundImage center">
                <div class="verificationBox">
                    <h2>Reset link has been sent to your email! </h2>
                    <p>From travellers.hut@mail.ru. Check the spam folder if you cannot find it.</p>
                </div>
            </div>
        </>
    );
};

export default ForgotSendPage;