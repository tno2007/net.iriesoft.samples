//https://www.byutv.org/player/3d0c6ee1-0755-41bd-8aec-007036b60641/dwight-in-shining-armor-flip
// C:\apps\net.iriesoft.samples.html\dist\vue-inside-angularjs

//const stdio = require("stdio");
// const color = await ask("What is your keyboard color?");

/**
 * todo
 * - create service-worker.js file from file list
 * - why did we add the gl.js file to service worker?
 *   - check what it does actually
 * - could we not just have used index.html page?
 * - parse folder-to-deploy (SOURCE_FOLDER)
 * - zip assets
 * - transfer zip to a server (another ip address / vm) use IP_ADDRESS or HOSTNAME
 * - create a backup folder on server
 * - copy files into BACKUP_FOLDER
 * - replace files in SITE_DESTINATION folder
 * -
 */

// declare scope variables
let SOURCE_FOLDER = "";
let ZIP_FILE = "";
let DESTINATION_HOST = "";
let DESTINATION_FOLDER = "";
let DESTINATION_BACKUP_FOLDER = "";

// import libraries
const fs = require("fs");
const path = require("path");
var argv = require("minimist")(process.argv.slice(2));
//const stdio = require("stdio");
const readlineSync = require("readline-sync");
//import { format, formatDistance, formatRelative, subDays } from "date-fns";
const datefns = require("date-fns");
const slash = require("slash");
const utilities = require("./utilities");
const AdmZip = require("adm-zip");

// print out passed in arguments
console.log(argv);

console.log();
console.log();

/*
if (!fs.existsSync(sourcePath)) {
  fs.mkdirSync(sourcePath);
}
*/

let obtainedSourceFolder = false;

while (obtainedSourceFolder === false) {
  SOURCE_FOLDER = readlineSync.question("Which folder do you want to deploy? ");
  if (fs.existsSync(SOURCE_FOLDER)) {
    console.log("123");
    obtainedSourceFolder = true;
    console.log("obtainedSourceFolder", obtainedSourceFolder);
  } else {
    console.log();
    console.log(
      "The folder you have specified does not exist. Please re-enter."
    );
  }
}

//SOURCE_FOLDER = path.join(__dirname, "../../../dist/vue-inside-angularjs");

fs.readdirSync(SOURCE_FOLDER).forEach((file) => {
  console.log(file);
});

/*
do {
  SOURCE_FOLDER = readlineSync.question("Which folder do you want to deploy? ");
  if (fs.existsSync(SOURCE_FOLDER)) {
    console.log("123");
    obtainedSourceFolder = true;
    console.log("obtainedSourceFolder", obtainedSourceFolder);
  } else {
    console.log();
    console.log(
      "The folder you have specified does not exist. Please re-enter."
    );
  }
} while (obtainedSourceFolder === false);
*/

// create the name of the zip folder
const dateAsString = datefns.format(new Date(), "yyyyMMdd'-'hhmm");

// zip up fthe source folder
const zipFileName = path.format({
  name: dateAsString,
  ext: ".zip",
});

ZIP_FILE = path.join(SOURCE_FOLDER, zipFileName);

// Create zip file
// ***************
const zip = new AdmZip();
zip.addLocalFolder(SOURCE_FOLDER);
fs.writeFileSync(ZIP_FILE, zip.toBuffer());

// Exit management
// ***************
process.on("exit", function (code) {
  return console.log(`About to exit with code ${code}`);
});

process.exit();
