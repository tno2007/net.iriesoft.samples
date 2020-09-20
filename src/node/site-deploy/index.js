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

let SOURCE_FOLDER = "";
let DESTINATION_HOST = "";
let DESTINATION_FOLDER = "";
let DESTINATION_BACKUP_FOLDER = "";

const fs = require("fs");
var argv = require("minimist")(process.argv.slice(2));
const zl = require("zip-lib");
//const stdio = require("stdio");
const readlineSync = require("readline-sync");
//import { format, formatDistance, formatRelative, subDays } from "date-fns";
const datefns = require("date-fns");

console.log(argv.a);

console.log();
console.log();

/*
if (!fs.existsSync(sourcePath)) {
  fs.mkdirSync(sourcePath);
}
*/

let obtainedSourceFolder = false;

while (!obtainedSourceFolder) {
  SOURCE_FOLDER = readlineSync.question("Which folder do you want to deploy? ");
  if (fs.existsSync(SOURCE_FOLDER)) {
    obtainedSourceFolder = true;
  } else {
    console.log();
    console.log(
      "The folder you have specified does not exist. Please re-enter."
    );
  }
}

// create the name of the zip folder
const dateAsString = datefns.format(new Date(), "yyyyMMdd'-'hhmm");

// zip up fthe source folder
zl.archiveFolder(SOURCE_FOLDER, `${SOURCE_FOLDER}/${dateAsString}.zip`).then(
  function () {
    console.log("done");
  },
  function (err) {
    console.log(err);
  }
);
