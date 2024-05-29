import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import "../../main.css";
import "./UserAuthStyle.css";

const EmailVerificationPage = () => {
    let { userName } = useParams();
    let { token } = useParams();
    const [ isValidToken, setIsValidToken ] = useState(false);

    function verifyEmailToken(userName, emailToken) {
        axios.post(`BACKEND_ADDRESS/verifyEmailToken`, { userName: userName, emailToken: token })
            .then(response => {
                const responseStatus = response.data.status;
                if (responseStatus == 'okay'){
                    setIsValidToken(true);
                }
            });
    }

    useEffect(() => {
        verifyEmailToken(userName, token);
    }, []);

    return (
        <>
            <div class="backgroundImage center">
            {isValidToken ? 
                <div class="verificationBox">
                    <h2>Email verified! </h2>
                    <p>You can now <span class="fakeLink"><Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit' }}>sign in</Link></span>.</p>
                </div>

            :

                <div class="verificationBox">
                    <h2>Something went wrong! </h2>
                    <p>Could not verify email or token is no longer valid.</p>
                </div>
            }
            </div>
        </>
    );
};

export default EmailVerificationPage;