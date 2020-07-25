const axios = require('axios');

let urlStart = 'http://bioinfo.hpc.cam.ac.uk/cellbase/webservices/rest/v4/hsapiens/feature/variation/';
let urlEnd = '/info?limit%3D-1%26skip%3D-1%26skipCount%3Dfalse%26count%3Dfalse%26Output%2520format%3Djson';

const asyncGetUrl = (id) => {
  let url = urlStart + id + urlEnd;

  axios.get( url ).then( (res) => {

    let frequencies;
    try {
      frequencies = res.data.response[0].result[0].annotation.populationFrequencies;

      let nfes = frequencies.filter( ( freq ) => {
        return freq.population == 'NEF';
      } );

      let genomes = nfes.find( ( item ) => item.study == 'GNOMAD_GENOMES' );

      if ( genomes ) {
        genomes.id = res.data.response[0].id;
        return genomes;
      } else {
        let exomes = nfes.find( ( item ) => item.study == 'GNOMAD_EXOMES' );
        if ( exomes ) {
          exomes.id = res.data.response[0].id;
          return exomes;
        }
      }
    } catch ( err ) {
      console.log('error name: ', err.name);
      console.log('error message: ', err.message);
      console.log(err.stack);
      let stack = err.stack;
      console.log(typeof(stack));
      return err;
    }
  })
}

exports.asyncGetUrl = asyncGetUrl;