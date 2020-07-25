const fs = require('fs');

const fileExists = function ( filePath, callback ) {
  fs.access( filePath, fs.constants.F_OK, ( err ) => {
    callback( !err );
  } );
}

exports.fileExists = fileExists;