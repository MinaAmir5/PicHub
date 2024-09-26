import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../commons/auth";
import axios from "axios";
const _ = require("lodash");

const baseUrl = "http://localhost:8800/api";

function Home() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [likeStatus, setLikeStatus] = useState({});
    useEffect(() => {
        const fetchLikes = async () => {
            let status = {};
            // Loop through the images and check if liked
            for (let i = 1; i <= 41; i++) {  // assuming 41 images
                const liked = await checkIfLiked(i);
                status[i] = liked === 1 ? true : false;
            }
            setLikeStatus(status);
        };
        fetchLikes();  // Call the function on mount to load the like status
    }, []);

    const [likesCount, setLikesCount] = useState({});

    useEffect(() => {
        const fetchLikesCount = async () => {
            try {
                // Fetch likes count for all pictures (assuming 41 pictures)
                for (let i = 1; i <= 40; i++) {
                    const response = await axios.get(`${baseUrl}/get-likes/${i}`);
                    setLikesCount((prevCounts) => ({
                        ...prevCounts,
                        [i]: response.data.likes,
                    }));
                }
            } catch (error) {
                console.error("Error fetching likes count:", error);
            }
        };

        fetchLikesCount();
    }, []);

    const checkIfLiked = async (num) => {
        if (!user) return null; // If no user, return null

        try {
            const response = await axios.get(`${baseUrl}/checkLike/${user}/${num}`);
            //alert(response.data[0]);
            return response.data;  // Returns 1 if liked, null if not
        } catch (error) {
            console.error("Error checking like:", error);
            return null;
        }
    };

    const handleLike = async (num) => {
        if (user) {
            setLikeStatus((prevStatus) => ({
                ...prevStatus,
                [num]: !prevStatus[num], // Toggle the like status
            }));
            setLikesCount((prevCounts) => ({
                ...prevCounts,
                [num]: prevCounts[num] + 1, // Increment likes count optimistically
            }));
            try {
                const response = await axios.post(`${baseUrl}/like-picture`, {
                    username: user,
                    num,
                });
                if (!response.data) {
                    // If there's an issue, revert the optimistic update
                    setLikesCount((prevCounts) => ({
                        ...prevCounts,
                        [num]: prevCounts[num] - 1, // Revert the like count
                    }));
                }
            } catch (error) {
                console.error("Error liking picture:", error);
                setLikeStatus((prevStatus) => ({
                    ...prevStatus,
                    [num]: !prevStatus[num], // Revert the like status
                }));
                setLikesCount((prevCounts) => ({
                    ...prevCounts,
                    [num]: prevCounts[num] - 1, // Revert likes count
                }));
            }
        } else {
            alert("Please sign in to like pictures.");
        }
    };

    const handleRedirect = () => {
        navigate('/sign');
    };

    const handleView = (num) => {
        const imageUrl = `${process.env.PUBLIC_URL}/assets/pic${num}.jpg`; // Assuming the images are in the public folder
        window.open(imageUrl, '_blank');  // Open the image in a new tab
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
                        <h5 id="sign">{user ? user : "Sign in"}</h5>
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
                                        <img src={likeStatus[num] ? "/heartFilled.png" : "/heartEmpty.png"}
                                            id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button onClick={() => handleLike(num)} id="num">{likesCount[num] || 0}</button>
                                        <button onClick={() => handleView(num)} id="view">View</button>
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
                                        <img src={likeStatus[num] ? "/heartFilled.png" : "/heartEmpty.png"}
                                            id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button onClick={() => handleLike(num)} id="num">{likesCount[num] || 0}</button>
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
                                        <img src={likeStatus[num] ? "/heartFilled.png" : "/heartEmpty.png"} id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button onClick={() => handleLike(num)} id="num">{likesCount[num] || 0}</button>
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