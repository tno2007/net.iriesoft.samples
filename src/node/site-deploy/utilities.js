const path = require("path");

exports.toPosixPath = function (pathstring) {
  // And heck, you don't even need to put it in a function unless
  // you need this conversion all over the place in your code.
  return pathstring.split(path.sep).join(path.posix.sep);
};
