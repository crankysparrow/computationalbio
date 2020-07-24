const fs = require('fs');
const axios = require('axios');
const cliProgress = require('cli-progress');

let outputValue;
let inputValue;
let popValue;
let dbValue;
console.log(path);
if (process.argv.length === 2) {
  console.error('I expected at least one argument! It should be the name of a file with SNP IDs, one per line.');
  process.exit(1);
} else if (process.argv.length === 4) {
console.log('No output data provided.I awill simply call it output.json')
outputValue = 'output/output.json'
const inputIndex = process.argv.indexOf('--input');
// Checks for --output and if we have a value
if (inputIndex > -1) {
  // Grabs the value after --input
  inputValue = process.argv[inputIndex + 1];
}
popValue = 'NFE' //default unless otherwise provided
dbValue = 'GNOMAD' //default unless otherwise provided
} else if (process.argv.length > 6) {
console.log('Good job, you provided but input and output file names')
// Checks for --output and if we have a value
const outputIndex = process.argv.indexOf('--output');
if (outputIndex > -1) {
  // Grabs the value after --outputut
  outputValue = process.argv[outputIndex + 1];
}
const inputIndex = process.argv.indexOf('--input');
// Checks for --output and if we have a value
if (inputIndex > -1) {
  // Grabs the value after --input
  inputValue = process.argv[inputIndex + 1];
}
const popIndex = process.argv.indexOf('--pop');
const dbIndex = process.argv.indexOf('--db');
if (popIndex > -1) {
  // Grabs the value after --input
  popValue = process.argv[popIndex + 1];
}
if (dbIndex > -1) {
  // Grabs the value after --input
  dbValue = process.argv[dbIndex + 1];
}
}
// Checks for --input and if we have a value
var path = process.cwd();
//console.log(path + "/" + inputValue);

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
        return freq.population == popValue;
      } );
     if ( dbValue == 'GNOMAD' ){
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
    } 
      // to do: add other dbase options     

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