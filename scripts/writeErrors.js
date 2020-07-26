const utils = require('./utils.js');

const writeErrors = (newErrors) => {

  utils.fileExists('./errorLogs')
    .then((exists) => {

      if (!exists) {
        return utils.mkDir('./errorLogs');
      } else {
        return;
      }

    }).then(() => {

      return utils.fileExists( './errorLogs/errors-log.json');

    }).then((exists) => {

      if ( exists ) {
        return utils.getFileContents( './errorLogs/errors-log.json' );
      } else {
        return [];
      }

    }).then((previousErrors) => {

      previousErrors.push(...newErrors);
      return utils.writeFile( './errorLogs/errors-log.json', previousErrors );

    }).then((path) => {

      console.log('Wrote errors to file: ', path);

    }).catch((err) => {

      console.error(err);

    })

}

module.exports = writeErrors;