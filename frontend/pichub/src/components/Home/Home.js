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
    const [likesCount, setLikesCount] = useState({});
    const [comments, setComments] = useState({}); // To store comments for each image
    const [visibleComments, setVisibleComments] = useState({}); // To track if the comment box is visible
    const [reportText, setReportText] = useState("");
    const [showReportBox, setShowReportBox] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // For search input
    const [images, setImages] = useState([]); // Store search result images

    const splitImagesIntoColumns = (images) => {
        let col1 = [], col2 = [], col3 = [];
        images.forEach((img, idx) => {
            if (idx % 3 === 0) {
                col1.push(img);
            } else if (idx % 3 === 1) {
                col2.push(img);
            } else {
                col3.push(img);
            }
        });
        return { col1, col2, col3 };
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search input
    };

    const handleSearch = async () => {
        try {
            if (searchQuery.trim() === "") {
                // Load all pictures if the search bar is cleared
                setImages(_.range(1, 30));  // Assuming there are 40 images, modify this range as needed
            } else {
                const response = await axios.get(`${baseUrl}/search`, {
                    params: { keyword: searchQuery }, // Send search query to backend
                });
                setImages(response.data); // Update images with search result
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    useEffect(() => {
        const fetchLikes = async () => {
            let status = {};
            // Loop through the images and check if liked
            for (let i = 1; i <= 30; i++) {  // assuming 41 images
                const liked = await checkIfLiked(i);
                status[i] = liked === 1 ? true : false;
            }
            setLikeStatus(status);
        };
        fetchLikes();  // Call the function on mount to load the like status
    }, []);

    useEffect(() => {
        const fetchLikesCount = async () => {
            try {
                // Fetch likes count for all pictures (assuming 41 pictures)
                for (let i = 1; i <= 30; i++) {
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
        if (user) {
            navigate('/account');  // Redirect to the uploads page
        } else {
            navigate('/sign');  // Redirect to sign-in page if not logged in
        }
    };

    const handleView = (num) => {
        const imageUrl = `${process.env.PUBLIC_URL}/assets/pic${num}.jpg`; // Assuming the images are in the public folder
        window.open(imageUrl, '_blank');  // Open the image in a new tab
    };

    const fetchComments = async (num) => {
        try {
            const response = await axios.get(`${baseUrl}/get-comments/${num}`);
            alert(response.data.comments);
            const fetchedComments = response.data.comments.split("_");
            setComments((prevComments) => ({
                ...prevComments,
                [num]: fetchedComments,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const toggleComments = (num) => {
        setVisibleComments((prevVisibility) => ({
            ...prevVisibility,
            [num]: !prevVisibility[num],
        }));

        if (!visibleComments[num]) {
            fetchComments(num); // Fetch comments only when opening the box
        }
    };

    const handleSubmitComment = async (num, newComment) => {
        try {
            const response = await axios.post(`${baseUrl}/add-comment`, {
                pictureNum: num,
                comment: newComment,
            });

            if (response.data) {
                setComments((prevComments) => ({
                    ...prevComments,
                    [num]: [...prevComments[num], newComment],
                }));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleReportSubmit = async (pictureNum) => {
        if (reportText.trim() === "") {
            alert("Report cannot be empty!");
            return;
        }
        try {
            await axios.post(`${baseUrl}/add-report`, {
                pictureNum,
                report: reportText
            });
            alert("Report submitted successfully");
            setReportText(""); // Clear the report box after submission
            setShowReportBox(false); // Hide the report box
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Error submitting report");
        }
    };

    const { col1, col2, col3 } = splitImagesIntoColumns(images.length ? images : _.range(1, 30));

    return (
        <div className="App">
            <header>
                <div class="background">
                    <div class="content">
                        <h1><span id="Pic">Pic</span><span id="Hub">Hub</span></h1><br />
                        <input type="text" value={searchQuery}
                            onChange={handleSearchChange} placeholder="Search pictures in PicHub" class="textbox" />
                        <button onClick={handleSearch} className="searchButton">
                            Search
                        </button>
                    </div>
                    <div class=" button" onClick={handleRedirect}>
                        <h5 id="sign">{user ? user : "Sign in"}</h5>
                    </div>
                </div>
            </header>
            <main>
                <div class="pics">
                    <div class="picsCol1">
                        {col1.map((num) => (
                            <React.Fragment key={num}>
                                <div class="pic">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/pic${num}.jpg`}
                                        alt={`pic${num}`}
                                    />
                                    <div class="bar">
                                        <img src={likeStatus[num] ? "/heartFilled.png" : "/heartEmpty.png"}
                                            id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button onClick={() => handleLike(num)} id="num">{likesCount[num] || 0}</button>
                                        <button onClick={() => handleView(num)} id="view">View</button>
                                        <button onClick={() => toggleComments(num)} id="comment">Comment</button>
                                        <button onClick={() => setShowReportBox(!showReportBox)} id="report">Report</button>
                                        {showReportBox && (
                                            <div className="report-box">
                                                <input
                                                    type="text"
                                                    value={reportText}
                                                    onChange={(e) => setReportText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && e.target.value) {
                                                            handleReportSubmit(num, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                    placeholder="Write your report here..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {visibleComments[num] && (
                                        <div className="commentSection">
                                            <div className="commentsBox">
                                                {comments[num] && comments[num].map((comment, idx) => (
                                                    <p key={idx}>{comment}</p>
                                                ))}
                                            </div>
                                            <div className="commentInput">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && e.target.value) {
                                                            handleSubmitComment(num, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
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
                                        <button onClick={() => handleLike(num)} id="num">{likesCount[num] || 0}</button>
                                        <button onClick={() => handleView(num)} id="view">View</button>
                                        <button onClick={() => toggleComments(num)} id="comment">Comment</button>
                                        <button onClick={() => setShowReportBox(!showReportBox)} id="report">Report</button>
                                        {showReportBox && (
                                            <div className="report-box">
                                                <input
                                                    type="text"
                                                    value={reportText}
                                                    onChange={(e) => setReportText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && e.target.value) {
                                                            handleReportSubmit(num, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                    placeholder="Write your report here..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {visibleComments[num] && (
                                        <div className="commentSection">
                                            <div className="commentsBox">
                                                {comments[num] && comments[num].map((comment, idx) => (
                                                    <p key={idx}>{comment}</p>
                                                ))}
                                            </div>
                                            <div className="commentInput">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && e.target.value) {
                                                            handleSubmitComment(num, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
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
                                        <img src={likeStatus[num] ? "/heartFilled.png" : "/heartEmpty.png"}
                                            id="heart_empty" class="shit" alt="Hear Empty" />
                                        <button onClick={() => handleLike(num)} id="num">{likesCount[num] || 0}</button>
                                        <button onClick={() => handleView(num)} id="view">View</button>
                                        <button onClick={() => toggleComments(num)} id="comment">Comment</button>
                                        <button onClick={() => setShowReportBox(!showReportBox)} id="report">Report</button>
                                        {showReportBox && (
                                            <div className="report-box">
                                                <input
                                                    type="text"
                                                    value={reportText}
                                                    onChange={(e) => setReportText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && e.target.value) {
                                                            handleReportSubmit(num, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                    placeholder="Write your report here..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {visibleComments[num] && (
                                        <div className="commentSection">
                                            <div className="commentsBox">
                                                {comments[num] && comments[num].map((comment, idx) => (
                                                    <p key={idx}>{comment}</p>
                                                ))}
                                            </div>
                                            <div className="commentInput">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && e.target.value) {
                                                            handleSubmitComment(num, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
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