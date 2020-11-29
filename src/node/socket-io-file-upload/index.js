"use strict";

// *****************************************************
// imports
// *****************************************************
const express = require("express");
const app = express();
const socket = require("socket.io");
const socketIoFile = require("socket.io-file");
const socketIoFileUpload = require("socketio-file-upload");
const path = require("path");
// *****************************************************
// uses
// *****************************************************
app.use(express.static(__dirname + "/public"));

// *****************************************************
// variables
// *****************************************************
const PORT = process.env.PORT || 3030;

// *****************************************************
// routes
// *****************************************************
app.get("/", (req, res, next) => {
  return res.sendFile(__dirname + "/client/index.html");
});

app.get("/app.js", (req, res, next) => {
  return res.sendFile(__dirname + "/client/app.js");
});

app.get("/bootstrap.css", (req, res, next) => {
  const file = path.join(
    __dirname,
    "../../../node_modules/bootstrap/dist/css/bootstrap.css"
  );
  return res.sendFile(file);
});

app.get("/socket.io.js", (req, res, next) => {
  const file = path.join(
    __dirname,
    "../../../node_modules/socket.io-client/dist/socket.io.js"
  );
  return res.sendFile(file);
});

app.get("/socket.io-file-client.js", (req, res, next) => {
  const file = path.join(
    __dirname,
    "../../../node_modules/socket.io-file-client/socket.io-file-client.js"
  );
  return res.sendFile(file);
});

// *****************************************************
// Starts the server
// *****************************************************
const server = app.listen(PORT, () => {
  console.log("Listening on port:", PORT, "use CTRL+C to close.");
});

// *****************************************************
// socket messages
// *****************************************************
const io = socket(server);

io.on("connection", (socket) => {
  console.log("Socket connected.");

  var uploader = new socketIoFile(socket, {
    // uploadDir: {			// multiple directories
    // 	music: 'data/music',
    // 	document: 'data/document'
    // },
    uploadDir: path.join(__dirname, "uploads"), // simple directory
    //accepts: ["audio/mpeg", "audio/mp3", "application/zip", "application/text"], // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
    accepts: [],
    maxFileSize: 150 * 1048576, // 150 MB. default is undefined(no limit)
    chunkSize: 10240, // default is 10240(1KB)
    transmissionDelay: 0, // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
    overwrite: true, // overwrite file if exists, default is true.
  });
  uploader.on("start", (fileInfo) => {
    console.log("Start uploading");
    console.log(fileInfo);
  });
  uploader.on("stream", (fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
  });
  uploader.on("complete", (fileInfo) => {
    console.log("Upload Complete.");
    console.log(fileInfo);
  });
  uploader.on("error", (err) => {
    console.log("Error!", err);
  });
  uploader.on("abort", (fileInfo) => {
    console.log("Aborted: ", fileInfo);
  });
});
