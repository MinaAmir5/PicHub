const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

//Register User.
router.post("/sign", async (req, res) => {
    if (req.body.request === "signUp") {
        
        const salt = await bcrypt.genSalt(10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: (await bcrypt.hash(req.body.password, salt)),//.toString(),
        });
        
        try {
            const user = await newUser.save();
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else if (req.body.request === "signIn") {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const bytes = bcrypt.compare(user.password, req.body.password);

            const accessToken = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                'my_secret_key',
                { expiresIn: "72h" }
            );

            const { password, ...info } = user._doc;
            if (!bytes) {
                res.status(400).json("Wrong password or username");
            } else {
                res.status(200).json({ ...info, accessToken });
                console.log({ ...info });
                console.log({ accessToken });
            }
        } else {
            res.status(401).json("User does not exists");
        }
    }
    else {
        console.log("erooooor");
    }
});

module.exports = router;