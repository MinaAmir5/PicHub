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

module.exports = router;