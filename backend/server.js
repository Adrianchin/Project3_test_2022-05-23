const express = require("express");
const multer = require("multer");
const s3Storage = require("multer-sharp-s3");
const aws = require("aws-sdk");
const { uploadFile, getFileStream } = require('./s3');
const { Support } = require("aws-sdk");

const {facelandmark} = require("./facelandmark");

const s3 = new aws.S3();
const app = express();

const storage = s3Storage({
  s3,
  Bucket: "project3inc",
  resize: {
    width: 400,
    height: 400,
   },
   options: {fit: "contain"},
  
  max: true,
});

const upload = multer({ storage: storage });

app.get("/images/:key", (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.post("/upload", upload.single("image"), (req, res, next) => {
  console.log(req.file); // Print upload details
  res.send("Successfully uploaded!");
});

app.get("/facelandmark", async (req, res, next) =>  {
  let response = await facelandmark()
  res.send(response)
});

app.listen(8080, () => console.log("listening on port 8080"));
