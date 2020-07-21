const fs = require('fs');
const axios = require('axios');
const cliProgress = require('cli-progress');

let urlStart = 'http://bioinfo.hpc.cam.ac.uk/cellbase/webservices/rest/v4/hsapiens/feature/variation/';
let urlEnd = '/info?limit%3D-1%26skip%3D-1%26skipCount%3Dfalse%26count%3Dfalse%26Output%2520format%3Djson';

let rsIDs = fs.readFileSync('rsIDs.json', 'utf8');

rsIDs = JSON.parse(rsIDs);
let test = rsIDs.slice(0, 30);
test.push('49035478');
test.push(rsIDs.slice(30, 70))

let promises = [];

test.forEach(id => {
  let url = urlStart + id + urlEnd;
  promises.push(axios.get(url));
});

Promise.allSettled(promises).then((responses) => {

  let results = [];


  let len = responses.length;

  responses.forEach(res => {

    let frequencies;
    try {
      frequencies = res.value.data.response[0].result[0].annotation.populationFrequencies;

      let nfes = frequencies.filter( ( freq ) => {
        return freq.population == 'NFE';
      } );

      let genomes = nfes.find( ( item ) => item.study == 'GNOMAD_GENOMES' )
      if ( genomes ) {
        genomes.id = res.value.data.response[0].id;
        results.push( genomes );
      } else {
        let exomes = nfes.find( ( item ) => item.study == 'GNOMAD_EXOMES' );
        if ( exomes ) {
          exomes.id = res.value.data.response[0].id;
          results.push( exomes );
        }
      }      

    } catch(err) {
      console.error(err);
    }

  });

  fs.writeFile('results-ALL2.json', JSON.stringify(results), (err) => {
    if (err) console.error(err)

    console.log('done!');

  
  });
}).catch((err) => {
  console.log(err);
})