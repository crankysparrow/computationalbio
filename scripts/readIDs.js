const fs = require('fs');

if (process.argv.length === 2) {
  console.error('I expected one argument! It should be the name of a file with SNP IDs, one per line.');
  process.exit(1);
} 

const inputIndex = process.argv.indexOf('--input');
// Checks for --output and if we have a value
if (inputIndex > -1) {
  // Grabs the value after --input
  inputValue = process.argv[inputIndex + 1];
}

var path = process.cwd();

let my_input= path + "/" + inputValue;
try {
  let data = fs.readFileSync(my_input, 'utf8');
  let arr = data.split('\n');
  fs.writeFile('input/rsIDs_jhs.json', JSON.stringify(arr), (err) => {
    if (err) console.log(err);
  })
} catch(e) {
  console.log('Error: ', e.stack);
}