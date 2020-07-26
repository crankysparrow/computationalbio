const fs = require('fs');

const fileExists = function( path ) {
  return new Promise( resolve => {
    fs.access( path, fs.F_OK, ( err ) => {
      if ( err ) {
        resolve( false );
      }

      resolve( true );
    } );
  } );
}

const mkDir = function(dir) {
  return new Promise( (resolve) => {
    fs.mkdir(dir, {}, (err) => {
      resolve(true);
    })
  })
}

const getFileContents = function(file) {
  return new Promise((resolve) => {
    fs.readFile(file, (err, res) => {
      resolve(JSON.parse(res));
    })
  })
}

const writeFile = function(path, write) {
  return new Promise((resolve) => {
    fs.writeFile(path, JSON.stringify(write), (err) => {
      resolve(path);
    })
  })
}

const dateString = function() {
  let date = new Date();
  let day = date.toLocaleDateString().split('/').join('-');
  let time = date.toLocaleTimeString().split(':').join('-').split(' ');
  return day + time[0];
}

exports.fileExists = fileExists;
exports.getFileContents = getFileContents;
exports.mkDir = mkDir;
exports.writeFile = writeFile;
exports.dateString = dateString;