const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Image schema
const ImageSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date, required: true }
});

// Create the Image model if it doesn't already exist
const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);

module.exports = Image;
