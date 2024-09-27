import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../commons/auth";
import axios from "axios";
const _ = require("lodash");

const baseUrl = "http://localhost:8800/api";

function Home() {

    const navigate = useNavigate(); // For navigation between pages
    const { user } = useAuth(); // For fetching user infromation

    const [likeStatus, setLikeStatus] = useState({}); // For storing liked status of pctures
    const [likesCount, setLikesCount] = useState({}); // For storing like counts of pictures
    const [comments, setComments] = useState({}); // To store comments for each image
    const [visibleComments, setVisibleComments] = useState({}); // To track if the comment box is visible
    const [reportText, setReportText] = useState(""); // To store reports for each image
    const [showReportBox, setShowReportBox] = useState(false); // To track if the report box is visible
    const [searchQuery, setSearchQuery] = useState(""); // For search input
    const [images, setImages] = useState([]); // Store search result images

    // Splits the images array into three nearly equal columns
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

    // Update the search input when the search bar changes
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search input
    };

    // Sends the search keywords to the database and return the intended pics then update the image array
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

    // Load the like status of each picture regarding the signed in user
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

    // Load the like counts for all pictures
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

    // fetches the like staus of the selected picture from the database
    const checkIfLiked = async (num) => {
        if (!user) return null; // If no user, return null

        try {
            const response = await axios.get(`${baseUrl}/checkLike/${user}/${num}`);
            return response.data;  // Returns 1 if liked, null if not
        } catch (error) {
            console.error("Error checking like:", error);
            return null;
        }
    };

    //handles the like button functionallity
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

    // Redirect to registeration or account page
    const handleRedirect = () => {
        if (user) {
            navigate('/account');  // Redirect to the uploads page
        } else {
            navigate('/sign');  // Redirect to sign-in page if not logged in
        }
    };

    // Handles the view button
    const handleView = (num) => {
        const imageUrl = `${process.env.PUBLIC_URL}/assets/pic${num}.jpg`; // Assuming the images are in the public folder
        window.open(imageUrl, '_blank');  // Open the image in a new tab
    };

    // Fetch pic comments from the database
    const fetchComments = async (num) => {
        try {
            const response = await axios.get(`${baseUrl}/get-comments/${num}`);
            const fetchedComments = response.data.comments.split("_");
            setComments((prevComments) => ({
                ...prevComments,
                [num]: fetchedComments,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Toggle the visability of the comment box
    const toggleComments = (num) => {
        setVisibleComments((prevVisibility) => ({
            ...prevVisibility,
            [num]: !prevVisibility[num],
        }));

        if (!visibleComments[num]) {
            fetchComments(num); // Fetch comments only when opening the box
        }
    };

    // Upload commet to database and update the comment box
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

    // Upload reports to database
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