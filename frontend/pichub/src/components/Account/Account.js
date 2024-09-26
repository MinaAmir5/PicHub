import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../commons/auth";
import axios from "axios";
const _ = require("lodash");

const baseUrl = "http://localhost:8800/api";

function Account() {

    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [uploads, setUploads] = useState([]);
    const [likedPictures, setLikedPictures] = useState([]);
    const [view, setView] = useState("uploads");

    const handleLogout = () => {
        logout(); // Clear the user from auth context
        navigate("/"); // Redirect to the main screen (homepage)
    };

    useEffect(() => {
        const fetchUploads = async () => {
            if (user) {
                try {
                    const response = await axios.get(`${baseUrl}/get-uploads/${user}`);
                    const uploadNumbers = response.data.split("_"); // Split the "uploads" string by underscores
                    setUploads(uploadNumbers);
                } catch (error) {
                    console.error("Error fetching uploads:", error);
                }
            }
        };
        const fetchLikedPictures = async () => {
            if (user) {
                try {
                    const response = await axios.get(`${baseUrl}/getUserlikes/${user}`);
                    const likedNumbers = response.data.split("_"); // Split the "likes" string by underscores
                    setLikedPictures(likedNumbers);
                } catch (error) {
                    console.error("Error fetching liked pictures:", error);
                }
            }
        };
        if (view === "uploads") {
            fetchUploads();
        } else if (view === "liked") {
            fetchLikedPictures();
        }
    }, [user, view]);

    const splitIntoColumns = (images) => {
        let col1 = [], col2 = [], col3 = [];
        images.forEach((num, index) => {
            if (index % 3 === 0) col1.push(num);
            else if (index % 3 === 1) col2.push(num);
            else col3.push(num);
        });
        return [col1, col2, col3];
    };

    const imagesToDisplay = view === "uploads" ? uploads : likedPictures;
    const [col1, col2, col3] = splitIntoColumns(imagesToDisplay);

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

    const handleView = (num) => {
        const imageUrl = `${process.env.PUBLIC_URL}/assets/pic${num}.jpg`; // Assuming the images are in the public folder
        window.open(imageUrl, '_blank');  // Open the image in a new tab
    };

    return (
        <div className="App">
            <header>
                <div class="content">
                    <img src="/logo.png" id="logo" />
                    <img onClick={handleLogout} src="/logOut.png" id="logOut" />
                    <h2><span id="Pic">Pic</span><span id="Hub">Hub</span></h2><br />
                </div>
                <div class=" button">
                    <h5 id="sign">{user}</h5>
                </div>
            </header>

            <div className="profileBar">
                <button onClick={() => setView("uploads")} className={view === "uploads" ? "active" : ""}>
                    Uploads
                </button>
                <button onClick={() => setView("liked")} className={view === "liked" ? "active" : ""}>
                    Liked
                </button>
            </div>

            <main>
                <div class="pics">
                    <div class="picsCol1">
                        {col1.map((num) => (
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
                                        <button id="num">{likesCount[num] || 0}</button>
                                        <button onClick={() => handleView(num)} id="view">View</button>
                                        <button id="comment">Comment</button>
                                        <button id="report">Report</button>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                        </div>
                    <div class="picsCol2">
                        {col2.map((num) => (
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
                                        <button id="num">{likesCount[num] || 0}</button>
                                        <button id="view">View</button>
                                        <button id="comment">Comment</button>
                                        <button id="report">Report</button>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div class="picsCol3">
                        {col3.map((num) => (
                            <React.Fragment key={num}>
                                <div class="pic">
                                    <img
                                        key={num}
                                        src={`${process.env.PUBLIC_URL}/assets/pic${num}.jpg`}
                                        alt={`pic${num}`}
                                    />
                                    <div class="bar">
                                        <img src={likeStatus[num] ? "/heartFilled.png" : "/heartEmpty.png"} id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button id="num">{likesCount[num] || 0}</button>
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

export default Account;