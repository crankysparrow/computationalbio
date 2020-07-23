const fs = require('fs');
const axios = require('axios');
const cliProgress = require('cli-progress');


if (process.argv.length === 2) {
  console.error('I expected at least one argument! It should be the name of a file with SNP IDs, one per line.');
  process.exit(1);
} else if (process.argv.length === 3) {
console.log('No output data provided.I awill simply call it output.json')
}
// Checks for --input and if we have a value
var path = process.cwd();
const inputIndex = process.argv.indexOf('--input');
let inputValue;

const outputIndex = process.argv.indexOf('--output');
let outputValue;

if (inputIndex > -1) {
  // Grabs the value after --input
  inputValue = process.argv[inputIndex + 1];
}
console.log(path + "/" + inputValue);

if (outputIndex > -1) {
  // Grabs the value after --outputut
  outputValue = process.argv[outputIndex + 1];
}
console.log(path + "/" + outputValue);


let urlStart = 'http://bioinfo.hpc.cam.ac.uk/cellbase/webservices/rest/v4/hsapiens/feature/variation/';
let urlEnd = '/info?limit%3D-1%26skip%3D-1%26skipCount%3Dfalse%26count%3Dfalse%26Output%2520format%3Djson';

let my_input = path + "/" + inputValue
let my_output = path + "/" + outputValue
var rsIDs = fs.readFileSync(my_input, 'utf8');
rsIDs = JSON.parse(rsIDs);


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
        } else {
          let g1000ph3 = nfes.find( ( item ) => item.study == '1kG_phase3' );
          if ( g1000ph3 ) {
            g1000ph3.id = res.data.response[0].id;
            results.push( g1000ph3 ); 

          }
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
  fs.writeFile(my_output, JSON.stringify(toWrite), (err) => {
    if (err) console.error(err);

    console.log(errors);
    console.log('done!');

  })
}

asyncGetUrl(i);