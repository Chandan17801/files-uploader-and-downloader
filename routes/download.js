const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

router.post("/", async (req, res) => {
  const paths = req.body;

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).send("No image paths provided");
  }

  const zipFileName = `images-${Date.now()}.zip`;
  const zipFilePath = path.join(__dirname, "../uploads", zipFileName);

  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error("Error downloading zip file:", err);
        res.status(500).send("Error downloading zip file");
      } else {
        fs.unlinkSync(zipFilePath);
      }
    });
  });

  archive.on("error", (err) => {
    console.error("Error creating zip archive:", err);
    res.status(500).send("Error creating zip archive");
  });

  archive.pipe(output);

  paths.forEach((imagePath) => {
    const filePath = path.join(__dirname, "../uploads", imagePath);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: path.basename(filePath) });
    } else {
      console.error(`File not found: ${filePath}`);
    }
  });

  archive.finalize();
});

router.post("/create-zip", async (req, res) => {
  const paths = req.body;

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).send("No image paths provided");
  }

  const zipFileName = `file-${Date.now()}.zip`;
  const zipFilePath = path.join(__dirname, "../uploads", zipFileName);

  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    // Send the URL for downloading the zip file
    const downloadUrl = `${process.env.BACKEND_URL}/download/download-zip/${zipFileName}`;
    res.status(200).json({ url: downloadUrl });
  });

  archive.on("error", (err) => {
    console.error("Error creating zip archive:", err);
    res.status(500).send("Error creating zip archive");
  });

  archive.pipe(output);

  paths.forEach((filePath) => {
    const fullFilePath = path.join(__dirname, "../uploads", filePath);
    if (fs.existsSync(fullFilePath)) {
      archive.file(fullFilePath, { name: path.basename(fullFilePath) });
    } else {
      console.error(`File not found: ${fullFilePath}`);
    }
  });

  await archive.finalize();
});

router.get("/download-zip/:filename", (req, res) => {
  const zipFilePath = path.join(__dirname, "../uploads", req.params.filename);

  if (fs.existsSync(zipFilePath)) {
    res.download(zipFilePath, (err) => {
      if (err) {
        res.status(500).send("Error downloading zip file");
      } else {
        fs.unlinkSync(zipFilePath);
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

router.get("/download-file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

module.exports = router;
