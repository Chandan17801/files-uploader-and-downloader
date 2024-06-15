const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Video schema
const VideoSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date, required: true }
});

// Create the Video model if it doesn't already exist
const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);

module.exports = Video;
