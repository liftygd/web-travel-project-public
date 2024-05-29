import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import "../../../main.css";
import "../UserAuthStyle.css";

const ForgotResetComplete = () => {
    return (
        <>
            <div class="backgroundImage center">
                <div class="verificationBox">
                    <h2>Reset complete! </h2>
                    <p>You can now <span class="fakeLink"><Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit' }}>sign in</Link></span>.</p>
                </div>
            </div>
        </>
    );
};

export default ForgotResetComplete;