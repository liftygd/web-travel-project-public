import React, { useState, useEffect } from 'react';

import "../../main.css";
import commentStyles from "./CommentStyle.module.css";

const CommentHeader = (props) => {
    return (
        <>
            <div className={commentStyles.reviewCell}>
                <div className={commentStyles.text}>
                    <h2>{props.userName}</h2>
                    <h3 className={commentStyles.publishDate}>{props.postDate}</h3>
                </div>

                <div className={commentStyles.descriptionText}>
                    <p>{props.comment}</p>
                </div>
            </div>
        </>
    );
};

export default CommentHeader;