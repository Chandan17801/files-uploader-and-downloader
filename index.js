const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const cron = require("node-cron");
const connectDb = require("./db/connectDb");
const imageRouter = require("./routes/image");
const videoRouter = require("./routes/video");
const downloadRouter = require("./routes/download");
const deleteFiles = require("./schedulerJobs/fileCleaner");

dotenv.config();

const app = express();
const PORT = 5100;

app.use(cors());
app.use(express.json());

const CHUNKS_DIR = "./chunks";
const UPLOADS_DIR = "./uploads";

if (!fs.existsSync(CHUNKS_DIR)) {
  fs.mkdirSync(CHUNKS_DIR);
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.use("/image", imageRouter);
app.use("/video", videoRouter);
app.use("/download", downloadRouter);

connectDb();

cron.schedule("0 0 * * *", deleteFiles);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
