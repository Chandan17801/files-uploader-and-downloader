const fs = require("fs");
const path = require("path");
const Image = require("../models/image");

const uploadImage = async (req, res) => {
  const { fileId, totalChunks, currentChunk, userId, name } = req.body;
  const { path: tempPath } = req.file;

  const destDir = `chunks/${fileId}`;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  const destPath = path.join(destDir, `chunk-${currentChunk}`);
  fs.renameSync(tempPath, destPath);

  if (parseInt(currentChunk) === parseInt(totalChunks)) {
    const finalPath = `uploads/${fileId}${name}`;
    const writeStream = fs.createWriteStream(finalPath);
    for (let i = 1; i <= totalChunks; i++) {
      const chunkPath = path.join(destDir, `chunk-${i}`);
      if (fs.existsSync(chunkPath)) {
        const data = fs.readFileSync(chunkPath);
        writeStream.write(data);
        fs.unlinkSync(chunkPath);
      } else {
        return res.status(500).send("Missing chunk " + i);
      }
    }
    writeStream.end(async () => {
      fs.rmdirSync(destDir);
      try {
        const newImage = new Image({
          name: `${fileId}${name}`,
          owner: userId,
          expiryDate: new Date(
            Date.now() + process.env.FILES_EXPIRY_IN_DAYS * 24 * 60 * 60 * 1000
          ),
        });
        await newImage.save();
        res.sendStatus(200);
      } catch (error) {
        fs.unlink(finalPath, (unlinkError) => {
          if (unlinkError) {
            console.error("Error deleting file:", unlinkError);
          }
          res.status(500).send("Error saving image to database");
        });
      }
    });
  } else {
    res.sendStatus(200);
  }
};

module.exports = { uploadImage };
