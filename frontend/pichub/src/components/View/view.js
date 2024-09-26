import React from 'react';
import { useParams } from 'react-router-dom';

function ViewPic() {
    const { num } = useParams();  // Extract the picture number from the URL params

    // Assuming the picture is stored in the public folder or accessed by some URL pattern
    const imageUrl = `${process.env.PUBLIC_URL}/assets/pic${num}.jpg`;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <img src={imageUrl} alt={`Picture ${num}`} style={{ maxWidth: "100%", height: "auto" }} />
        </div>
    );
}

export default ViewPic;