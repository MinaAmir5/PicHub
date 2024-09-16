const express = require("express");
const app = express();
const authRoute = require("./routes/auth");

const port = 8800;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoute);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});