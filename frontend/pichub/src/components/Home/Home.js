import React from "react";
import { useNavigate } from 'react-router-dom';
const _ = require("lodash");

function Home() {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/Sign');
    };

    let images = _.range(1, 15);
    let images2 = _.range(15, 29);
    let images3 = _.range(29, 41);

    return (
        <div className="App">
            <header>
                <div class="background">
                    <div class="content">
                        <h1><span id="Pic">Pic</span><span id="Hub">Hub</span></h1><br />
                        <input type="text" placeholder="Search pictures in PicHub" class="textbox" />
                    </div>
                    <div class=" button" onClick={handleRedirect}>
                        <h5 id="sign">Sign in</h5>
                    </div>
                </div>
            </header>
            <main>
                <div class="pics">
                    <div class="picsCol1">
                        {images.map((num) => (
                            <React.Fragment key={num}>
                                <div class="pic">
                                    <img
                                        key={num}
                                        src={`${process.env.PUBLIC_URL}/assets/pic${num}.jpg`}
                                        alt={`pic${num}`}
                                    />
                                    <div class="bar">
                                        <img src="/Heart_Empty.jpg" id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button id="num">15</button>
                                        <button id="view">View</button>
                                        <button id="comment">Comment</button>
                                        <button id="report">Report</button>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div class="picsCol2">
                        {images2.map((num) => (
                            <React.Fragment key={num}>
                                <div class="pic">
                                    <img
                                        key={num}
                                        src={`${process.env.PUBLIC_URL}/assets/pic${num}.jpg`}
                                        alt={`pic${num}`}
                                    />
                                    <div class="bar">
                                        <img src="/Heart_Empty.jpg" id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button id="num">15</button>
                                        <button id="view">View</button>
                                        <button id="comment">Comment</button>
                                        <button id="report">Report</button>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div class="picsCol3">
                        {images3.map((num) => (
                            <React.Fragment key={num}>
                                <div class="pic">
                                    <img
                                        key={num}
                                        src={`${process.env.PUBLIC_URL}/assets/pic${num}.jpg`}
                                        alt={`pic${num}`}
                                    />
                                    <div class="bar">
                                        <img src="/Heart_Empty.jpg" id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button id="num">15</button>
                                        <button id="view">View</button>
                                        <button id="comment">Comment</button>
                                        <button id="report">Report</button>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );

}

export default Home;