const fs = require('fs');

try {
  let data = fs.readFileSync('input/rsIDs_whi.txt', 'utf8');
  let arr = data.split('\n');
  fs.writeFile('input/rsIDs_whi.json', JSON.stringify(arr), (err) => {
    if (err) console.log(err);
  })
} catch(e) {
  console.log('Error: ', e.stack);
}