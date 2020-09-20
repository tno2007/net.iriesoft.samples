"use strict";

const uploadDirectory = `${__dirname}/uploads`;

const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 3000;
const app = express();

// default options
app.use(fileUpload());

//app.use(express.static("public"));

//app.use("/", express.static("public"));

//app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

/*
app.get("/", function (req, res) {
  console.log(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/public/index.html");
});
*/

// creates upload directory if it does not exist.
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// express-fileupload application.
app.post("/upload", function (req, res) {
  if (!req.files) return res.status(400).send("No files were uploaded.");

  // The name of the input field (i.e "sampleFile") is used to retrieve the uploaded file.
  let sampleFile = req.files.sampleFile;

  // use the mv() method to place the file somewhere on your server.
  sampleFile.mv(`${uploadDirectory}/${sampleFile.name}`, function (err) {
    console.log(sampleFile);
    if (err) return res.status(500).send(err);

    // checks the file size
    let stats = fs.statSync(`${uploadDirectory}/${sampleFile.name}`);
    let fileSizeInBytes = stats.size;

    // res.send(`${sampleFile.name} Uploaded!  ${fileSizeInBytes} Bytes`);

    res.sendFile(__dirname + "/public/index.html");
    // res.send(uploadComplete());
  });
});

// Starts the server.
app.listen(PORT, () => {
  console.log("Listening on port:", PORT, "use CTRL+C to close.");
});
