const fs = require('fs');

if (process.argv.length < 4) {
  console.error('I expected at least one argument! It should be the name of a file with SNP IDs, one per line.');
  process.exit(1);
} 

const inputIndex = process.argv.indexOf('--input');
// Checks for --output and if we have a value
if (inputIndex > -1) {
  // Grabs the value after --input
  inputValue = process.argv[inputIndex + 1];
}

const outputIndex = process.argv.indexOf('--output');
// Checks for --output and if we have a value
if (outputIndex > -1) {
  // Grabs the value after --input
  outputValue = process.argv[outputIndex + 1];
}

if (typeof outputValue == "undefined") {
  outputValue = 'input/my_input.json';
}
var path = process.cwd();

let my_input= path + "/" + inputValue;
let my_output= path + "/" + outputValue;

try {
  let data = fs.readFileSync(my_input, 'utf8');
  let arr = data.split('\n');
  fs.writeFile(my_output, JSON.stringify(arr), (err) => {
    if (err) console.log(err);
  })
} catch(e) {
  console.log('Error: ', e.stack);
}