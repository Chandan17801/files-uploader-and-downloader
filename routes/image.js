const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/fileUpload");
const isAuthenticated = require("../middleware/authentication");

const { uploadImage } = require("../controllers/image");

const UPLOADS_DIR = path.join(__dirname, "../uploads");

router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).send("Error serving file");
  }
});

router.post("/upload", isAuthenticated, upload.single("file"), uploadImage);

module.exports = router;
