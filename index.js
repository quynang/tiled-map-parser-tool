//demo
var tmx = require('tmx-parser');
tmx.parseFile('world-1-1_map.tmx', function(err, map) {
  if (err) throw err;
  console.log(map.layers[2].objects);
});