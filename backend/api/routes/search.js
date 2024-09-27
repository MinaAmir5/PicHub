const router = require("express").Router();
const User = require("../models/User");
const Pic = require("../models/Pic");

router.get("/checkLike/:username/:num", async (req, res) => {
    const { username, num } = req.params;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json(null);
        }
        const likesArray = user.likes ? user.likes.split("_") : [];

        const isLiked = likesArray.includes(num);

        if (isLiked) {
            return res.status(200).json(1); // Number found in likes
        } else {
            return res.status(200).json(null); // Number not found in likes
        }

    } catch (err) {
        return res.status(500).json("An error occurred");
    }
});

router.post("/like-picture", async (req, res) => {
    const { username, num } = req.body; // Assuming 'username' and 'num' are sent from the frontend
    // Find the picture by its number and increment the likes count

    const updatedPic = await Pic.findOneAndUpdate(
        { num: num }, // Find the picture with the given num
        { $inc: { likes: 1 } }, // Increment the likes field
        { new: true } // Return the updated document
    );
    try {
        const user = await User.findOne({ username });

        if (user) {
            let likes = user.likes || "";  // Initialize 'likes' if it's not defined
            const likesArray = likes.split("_").filter(Boolean); // Split by _ and filter out empty strings

            if (!likesArray.includes(num.toString())) {
                likesArray.push(num.toString());
                user.likes = likesArray.join("_"); // Join the updated array with underscores
            } else {
                return { message: "Picture already liked!" }; // Optional: If picture already liked
            }

            await user.save();

        }
    } catch (err) {
        console.error(err);
    }
});

router.get('/get-likes/:num', async (req, res) => {
    const picNum = req.params.num; // Get picture number from the request params

    try {
        // Find the picture with the given num (picture number)
        const pic = await Pic.findOne({ num: picNum });

        // If no picture is found, return an error
        if (!pic) {
            return res.status(404).json({ message: "Picture not found" });
        }

        // Return the likes count
        res.status(200).json({ likes: pic.likes });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/get-uploads/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            res.status(200).json(user.uploads);  // Send the "uploads" field
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        res.status(500).json("Error fetching uploads");
    }
});

router.get('/getUserlikes/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            res.status(200).json(user.likes);  // Send the "likes" field
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        res.status(500).json("Error fetching likes");
    }
});

router.get('/search', async (req, res) => {
    const { keyword } = req.query;

    try {
        // Search for images where the keywords field contains the search keyword
        const images = await Pic.find(
            { keywords: { $regex: keyword, $options: 'i' } },  // 'i' makes the search case-insensitive
            { num: 1, _id: 0 }  // Project only the 'num' field, exclude the '_id'
        );

        // If images are found, return their numbers
        const pictureNumbers = images.map(image => image.num);
        if (pictureNumbers.length > 0) {
            return res.status(200).json(pictureNumbers);
        } else {
            return res.status(404).json({ message: 'No images found for the given keyword' });
        }
    } catch (error) {
        console.error('Error searching images:', error);
        return res.status(500).json({ message: 'Error searching images' });
    }
});

router.get('/get-comments/:num', async (req, res) => {
    const { num } = req.params;

    try {
        const picture = await Pic.findOne({ number: num });

        if (!picture) {
            return res.status(404).json({ message: "Picture not found" });
        }

        const comments = picture.comments || '';  // In case comments field is empty
        res.json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/add-comment', async (req, res) => {
    const { pictureNum, comment } = req.body;

    try {
        const picture = await Pic.findOne({ number: pictureNum });

        if (!picture) {
            return res.status(404).json({ message: "Picture not found" });
        }

        // Append the new comment to the existing comments, separated by an underscore
        picture.comments = picture.comments ? picture.comments + "_" + comment : comment;

        await picture.save();
        res.json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/add-report', async (req, res) => {
    const { pictureNum, report } = req.body;

    try {
        const picture = await Pic.findOne({ number: pictureNum });

        if (!picture) {
            return res.status(404).json({ message: "Picture not found" });
        }

        // Append the new report to the existing reports, separated by an underscore
        picture.reports = picture.reports ? picture.reports + "_" + report : report;

        await picture.save();
        res.json({ message: "Report added successfully" });
    } catch (error) {
        console.error("Error adding report:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/delete-upload', async (req, res) => {
    const { username, picNum } = req.body;
    const user = await User.findOne({ username });
    try {
        let uploadsArray = user.uploads.split("_");
        uploadsArray = uploadsArray.filter(pic => pic !== String(picNum));
        user.uploads = uploadsArray.join("_");
        await user.save();
        res.status(200).send("Upload removed successfully");
    } catch (error) {
        console.log("shit");
        res.status(500).send("Error deleting upload");
    }
});

// Route to delete like from user's likes and decrement likes in the picture document
router.post('/delete-like', async (req, res) => {
    const { username, picNum } = req.body;
    const user = await User.findOne({ username });
    try {
        // Remove from user's likes
        let likesArray = user.likes.split("_");
        likesArray = likesArray.filter(pic => pic !== String(picNum));
        user.likes = likesArray.join("_");
        await user.save();
        // Decrement the like count on the picture
        const picture = await Pic.findOne({ num: picNum });
        if (picture) {
            picture.likes = Math.max(picture.likes - 1, 0); // Avoid negative likes
            await picture.save();
        }
        res.status(200).send("Like removed successfully");
    } catch (error) {
        res.status(500).send("Error deleting like");
    }
});

module.exports = router;