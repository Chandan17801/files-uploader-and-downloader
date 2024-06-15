const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const upload = require("../middleware/fileUpload");

const UPLOADS_DIR = path.join(__dirname, "../uploads");

const { uploadVideo } = require("../controllers/video");

router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).send("File not found");
      }
      return res.status(500).send("Error serving file");
    }

    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, {
        "Content-Length": stats.size,
        "Content-Type": "video/mp4",
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

    if (start >= stats.size || end >= stats.size) {
      res
        .status(416)
        .send(
          "Requested range not satisfiable\n" + start + " >= " + stats.size
        );
      return;
    }

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stats.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fileStream.pipe(res);
  });
});

router.post("/upload", upload.single("file"), uploadVideo);

module.exports = router;
