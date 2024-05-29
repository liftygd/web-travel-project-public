import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Gallery from '../image/Gallery';

import NewsImage1 from "../../images/news/news1.jpg";
import NewsImage2 from "../../images/news/news2.jpg";

import "../../main.css";
import mainPageStyles from "./MainPageStyle.module.css";

const MainPage = () => {
    return (
        <>
            <div className={mainPageStyles.main}>
                <div className={ `${mainPageStyles.backgroundImage} center`}>
                    <h2 className={ `${mainPageStyles.text} ${mainPageStyles.h2}` }>Open your mind to new experiences</h2>
                    <p className={mainPageStyles.text}>Travel is a great way to maintain mental well-being, and, by extension, it contributes to a happier and more fulfilling life. 
                    Travel connects people and provides opportunities to learn about new and different cultures, which can help increase your empathy towards others.</p>
                </div>
                
                <div className={ `${mainPageStyles.gallery} center`}>
                    <h2 class="cell" style={{ marginTop:"50px" }}>News</h2>
                    <h3 style={{ textAlign:"center" }}>See what has been happening lately.</h3>
                </div>

                <div className={ `${mainPageStyles.gallery} center`}>
                    <Gallery 
                        title="New hiking trail has been established in the middle of Colorado." 
                        description="Finally, a new challenge for all the hikers and travelers of Colorado has appeared. 
                            Take on this new route to see the beautiful sights of the Colorado landscape. 
                            The route goes up north and continues into the states above, so you are not only bound by one state. 
                            This route is not very hard, so even beginners can try it out and maybe, that will leave them waiting for more!"
                        image={NewsImage1}
                    />
                </div>

                <div className={ `${mainPageStyles.gallery} center`}>
                    <Gallery 
                        title="Angry man tries to blow up the Grand Canyon." 
                        description="A man has been caught trying to rig the Grand Canyon with a bunch of explosives. When questioned, he said that 
                            ''the Grand Canyon is overrated, I hate it. 
                            Why does everyone like it? It is literally empty.''
                            He is currently in the custody of the police, so we will see where this whole ordeal goes."
                        image={NewsImage2}
                    />
                </div>
            </div>
        </>
    );
};

export default MainPage;