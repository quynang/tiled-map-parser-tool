import * as fs from 'fs';
import xml2js from 'xml2js'
const parser = new xml2js.Parser();


const calcCellX = (x) => {
  const cellX =  Math.floor(x / process.env.CELL_SIZE);
  return cellX;
};

const calcCellY = (y) => {
  const cellY =  Math.floor(y / process.env.CELL_SIZE);
  return cellY;
};

const addCommentForObjects = (data) => {
  const tileSets = data.map.tileset
  
  tileSets.forEach(tile => {

    (function () {
      const stringline = `#${tile['$'].firstgid}: ${tile['$'].name}\n`

      fs.appendFile('output.txt', stringline , function (err) {
        if (err) return console.log(err);
        console.log('Appended!');
      })
    })();

  }) 
}

export default function parseGridData() {
  fs.readFile(process.env.FILE_NAME, function(err, data) {

    if (err) return console.log(err);
  
    parser.parseString(data, function (err, result) {
  
      if (err) return console.log(err);

      addCommentForObjects(result);

      const objects = result.map.objectgroup[0].object

      objects.forEach((object) => {

        (function () {
          const stringline = `${object['$'].gid}\t${object['$'].x}\t${object['$'].y}\t${calcCellX(object['$'].x)}\t${calcCellY(object['$'].y)}\n`
  
          fs.appendFile('output.txt', stringline , function (err) {
            if (err) return console.log(err);
            console.log('Appended!');

          })
        })();

      })
    })
  }) 
}