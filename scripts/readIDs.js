const fs = require('fs');

try {
  let data = fs.readFileSync('rsIDs.txt', 'utf8');
  let arr = data.split('\n');
  fs.writeFile('rsIDs.json', JSON.stringify(arr), (err) => {
    if (err) console.log(err);
  })
} catch(e) {
  console.log('Error: ', e.stack);
}