const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const searchRoute = require("./routes/search");

const port = 8800;

mongoose.connect("mongodb+srv://minaamir55555:Marmena531.@pichub.2n3om.mongodb.net/pichub?retryWrites=true&w=majority&appName=pichub")
    .then(() => console.log("DB Connection successfully!"))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoute);
app.use("/api", authRoute);
app.use("/api/search", searchRoute);
app.use("/api", searchRoute);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});