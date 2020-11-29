/**
 * # Notes:
 *
 * ## https://www.w3.org/TR/FileAPI/#dfn-filereader
 *
 * Note: The use of readAsArrayBuffer() is preferred over readAsBinaryString(),
 */

"use strict";

const uploadDirectory = `${__dirname}/uploads`;

const fs = require("fs");
const path = require("path");
const express = require("express");
var bodyParser = require("body-parser");
const multer = require("multer");
const formidable = require("formidable");

var cors = require("cors");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 3000;
const app = express();

// default options
app.use(fileUpload()); // enable express-fileupload plugin
app.use(cors()); // enable cors

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false, limit: "150mb" }));

// parse application/json
//app.use(bodyParser.json());

var upload = multer({ dest: "uploads/" });

// enable pre-flight (http options)
app.options("*", cors()); // include before other routes

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

var cpUpload = upload.fields([
  { name: "section", maxCount: 1 },
  { name: "theFile", maxCount: 1 },
]);
app.post("/multer", cpUpload, function (req, res, next) {
  console.log("multer req.files", req.files["section"]);

  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});

app.post("/formidable", cpUpload, function (req, res, next) {
  var form = new formidable.IncomingForm(); //Receive form

  form.parse(req, function (err, fields, files) {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });
});

app.post(
  "/upload-with-filereader",
  /*upload.single("theFile"),*/ function (req, res, next) {
    //console.log("req", req);
    //console.log("req.files", req.files);

    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      console.log("form", form);
    });

    /**
     * files: { theFile: {//...} }
     * body: { section: 'general' },
     */

    form.on("file", function (name, file) {
      console.log("file-ing");
    });

    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  }
);

app.post("/upload-with-filereader-z", function (req, res) {
  var photos = [],
    form = new formidable.IncomingForm();

  // Tells formidable that there will be multiple files sent.
  form.multiples = true;
  // Upload directory for the images
  form.uploadDir = path.join(__dirname, "tmp_uploads");

  // Invoked when a file has finished uploading.
  form.on("file", function (name, file) {
    console.log("file-ing");
    // Allow only 3 files to be uploaded.
    if (photos.length === 3) {
      fs.unlink(file.path);
      return true;
    }

    var buffer = null,
      type = null,
      filename = "";

    // Read a chunk of the file.
    buffer = readChunk.sync(file.path, 0, 262);
    // Get the file type using the buffer read using read-chunk
    type = fileType(buffer);

    // Check the file type, must be either png,jpg or jpeg
    if (
      type !== null &&
      (type.ext === "png" || type.ext === "jpg" || type.ext === "jpeg")
    ) {
      // Assign new file name
      filename = Date.now() + "-" + file.name;

      // Move the file with the new file name
      fs.rename(file.path, path.join(__dirname, "uploads/" + filename));

      // Add to the list of photos
      photos.push({
        status: true,
        filename: filename,
        type: type.ext,
        publicPath: "uploads/" + filename,
      });
    } else {
      photos.push({
        status: false,
        filename: file.name,
        message: "Invalid file type",
      });
      fs.unlink(file.path);
    }
  });

  form.on("error", function (err) {
    console.log("Error occurred during processing - " + err);
  });

  // Invoked when all the fields have been processed.
  form.on("end", function () {
    console.log("All the request fields have been processed.");
  });

  // Parse the incoming form fields.
  form.parse(req, function (err, fields, files) {
    res.status(200).json(photos);
  });
});

app.post("/upload-with-filereader-y", function (req, res, next) {
  console.log("route: /upload-with-filereader");

  let form = new formidable.IncomingForm();

  form.multiples = true;

  form
    .parse(req)
    .on("field", (name, field) => {
      console.log("Field", name, field);
    })
    .on("file", (name, file) => {
      console.log("Uploaded file", name, file);
    })
    .on("aborted", () => {
      console.error("Request aborted by the user");
    })
    .on("error", (err) => {
      console.error("Error", err);
      throw err;
    })
    .on("end", () => {
      console.error("on end");
      res.end();
    });

  console.error("lastly...");
  if (err) return res.status(200).send("hello");
});

// express-fileupload application.
app.post("/upload-with-filereader-x", function (req, res) {
  console.log("route: /upload-with-filereader-x");
  console.log("req.body", req.body);
  if (!req.files) return res.status(400).send("No files were uploaded.");

  // The name of the input field (i.e "sampleFile") is used to retrieve the uploaded file.
  console.log("req.files", req.files);
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
    console.log("upload complete");
    // res.send(uploadComplete());
  });
});

app.post("/upload", function (req, res) {
  console.log("route: /upload");

  if (!req.files) return res.status(400).send("No files were uploaded.");

  // The name of the input field (i.e "sampleFile") is used to retrieve the uploaded file.
  console.log("req.files", req.files);
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
    console.log("upload complete");
    // res.send(uploadComplete());
  });
});

// Starts the server.
app.listen(PORT, () => {
  console.log("Listening on port:", PORT, "use CTRL+C to close.");
});
