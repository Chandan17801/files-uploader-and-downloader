const Image = require("../models/image");
const fs = require("fs");
const path = require("path");
const Video = require("../models/video");

const deleteFiles = async () => {
    console.log("working");
  try {
    const expiryDate = new Date();

    const expiredImages = await Image.find({ expiryDate: { $lt: expiryDate } });
    
    for (const image of expiredImages) {
      const imagePath = path.join(__dirname, "../uploads", image.name);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted expired image at path: ${imagePath}`);
      } else {
        console.log(`File does not exist at path: ${imagePath}`);
      }

      await Image.deleteOne({ _id: image._id });
      console.log(`Deleted image document with ID: ${image._id}`);
    }
    const expiredVideos = await Video.find({ expiryDate: { $lt: expiryDate } });
    console.log(expiredVideos);

    for (const video of expiredVideos) {
      const videoPath = path.join(__dirname, "../uploads", video.name);

      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
        console.log(`Deleted expired video at path: ${videoPath}`);
      } else {
        console.log(`File does not exist at path: ${videoPath}`);
      }

      await Video.deleteOne({ _id: video._id });
      console.log(`Deleted video document with ID: ${video._id}`);
    }
  } catch (error) {
    console.error("Error deleting expired images:", error);
  }
};

module.exports = deleteFiles;
