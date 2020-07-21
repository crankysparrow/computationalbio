const fs = require('fs');
const axios = require('axios');
const cliProgress = require('cli-progress');

let urlStart = 'http://bioinfo.hpc.cam.ac.uk/cellbase/webservices/rest/v4/hsapiens/feature/variation/';
let urlEnd = '/info?limit%3D-1%26skip%3D-1%26skipCount%3Dfalse%26count%3Dfalse%26Output%2520format%3Djson';

let rsIDs = fs.readFileSync('rsIDs.json', 'utf8');

rsIDs = JSON.parse(rsIDs);
// let test = rsIDs.slice(0, 30);
// let len = test.length;

let len = rsIDs.length;
let i = 0;

let results = [];
let errors = [];
const bar1 = new cliProgress.SingleBar({
  format: 'Progress | [{bar}] | {percentage}% || {value}/{total} items',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',    
})
bar1.start(len, 0, {
  speed: 'N/A'
});

function asyncGetUrl(i) {
  let url = urlStart + rsIDs[i] + urlEnd;

  axios.get( url ).then( ( res ) => {

    bar1.increment();
    let frequencies;
    try {
      frequencies = res.data.response[0].result[0].annotation.populationFrequencies;
      
      let nfes = frequencies.filter( ( freq ) => {
        return freq.population == 'NFE';
      } );

      let genomes = nfes.find( ( item ) => item.study == 'GNOMAD_GENOMES' )
      if ( genomes ) {
        genomes.id = res.data.response[0].id;
        results.push( genomes );
      } else {
        let exomes = nfes.find( ( item ) => item.study == 'GNOMAD_EXOMES' );
        if ( exomes ) {
          exomes.id = res.data.response[0].id;
          results.push( exomes );
        }
      }      

    } catch ( err ) {
      errors.push({
        error: err,
        id: rsIDs[i]
      });
    }

    i++;
    if (i == len) {
      bar1.stop();
      write(results);

    } else {
      asyncGetUrl( i );
    }
  } ).catch((err) => {
    errors.push(err);
  })

}

function write(toWrite) {
  fs.writeFile('./results/results-all.json', JSON.stringify(toWrite), (err) => {
    if (err) console.error(err);

    console.log(errors);
    console.log('done!');

  })
}

asyncGetUrl(i);