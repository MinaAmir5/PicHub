const mongoose = require("mongoose");

const PicSchema = new mongoose.Schema(
    {
        num: { type: Number, required: true, unique: true },
        likes: { type: Number,  default: 0 },
    }
);

module.exports = mongoose.model("Pic", PicSchema);