import * as fs from 'fs';
import xml2js from 'xml2js'
const parser = new xml2js.Parser();

const CELL_SIZE = process.env.CELL_SIZE
const INPUT_FILE_NAME = process.env.FILE_NAME

const OUT_PUT_FILE_NAME = 'grid.txt'

const calcCellX = (x) => {
  const cellX =  Math.floor(x / process.env.CELL_SIZE);
  return cellX;
}

const calcCellY = (y) => {
  const cellY =  Math.floor(y / process.env.CELL_SIZE);
  return cellY;
}


const parseCells = (data) => {
  const mapWidth =  data.map['$'].width * data.map['$'].tilewidth
  const mapHeight = data.map['$'].height * data.map['$'].tileheight
  const numCellX = Math.floor(mapWidth/CELL_SIZE)
  const numCellY = Math.floor(mapHeight/CELL_SIZE)
  const numCell = numCellX * numCellY
  const cells = []

  for(let i = 0; i < numCell; i++)
  {
    cells.push({
      'index_x': i % numCellX,
      'index_y': Math.floor(i/numCellX),
      'object_ids': []
    })
  }

  return cells
}

const writeCellInfoToFile = (cells) => {
  fs.appendFile(OUT_PUT_FILE_NAME, '[CELLS]\n', function (err) {
    if (err) return console.log(err);
    console.log('Appended!');
  })

  cells.forEach((cell, index) => {
    const object_ids = cell.object_ids.length ? '\t' + cell.object_ids.join('\t') : ''
    const stringline = cell.index_x + '\t' + cell.index_y + object_ids + '\n'
    setTimeout(() => {
      fs.appendFile(OUT_PUT_FILE_NAME, stringline , function (err) {
        if (err) return console.log(err);
        console.log('Appended!');
      }) 
    }, index*100);
    
  });

}

const getCellIndex = (x, y, data) => {

  const mapWidth =  data.map['$'].width * data.map['$'].tilewidth
  const mapHeight = data.map['$'].height * data.map['$'].tileheight
  const numCellX = Math.floor(mapWidth/CELL_SIZE)
  const numCellY = Math.floor(mapHeight/CELL_SIZE)

  if (x < 0) x = 0;
  if (x >= numCellX) x = numCellX - 1;
  if (y < 0) y = 0;
  if (y >= numCellY) y = numCellY - 1;

  return y * numCellX + x
}

const writeGridInfoToFile = (data) => {
  const mapWidth =  data.map['$'].width * data.map['$'].tilewidth
  const mapHeight = data.map['$'].height * data.map['$'].tileheight
  const numCellX = Math.floor(mapWidth/CELL_SIZE)
  const numCellY = Math.floor(mapHeight/CELL_SIZE)
  const string = `[INFO]\n` + numCellX + '\t' + numCellY + '\t' + CELL_SIZE + '\n'
  fs.appendFile(OUT_PUT_FILE_NAME, string, function (err) {
    if (err) return console.log(err);
    console.log('Appended!');
  }) 
}

export default function parseGridData() {
  fs.readFile(INPUT_FILE_NAME, function(err, data) {

    if (err) return console.log(err);
  
    parser.parseString(data, function (err, result) {
  
      if (err) return console.log(err);

      writeGridInfoToFile(result)

      const objects = result.map.objectgroup[0].object
      const cells = parseCells(result)

      objects.forEach((object) => {
        (function () {
    
          const { id, x, y, gid, height } = object['$']

          let y_on_codebase = y - height

          //For those objects which was create by inserting Reactangle. Y is different from object was created by inserting image. 
          if(!gid) {
            y_on_codebase = y
          }

          const cellIndex = getCellIndex(calcCellX(x), calcCellY(y_on_codebase), result)
          cells[cellIndex].object_ids.push(id)

        })();

      })

      writeCellInfoToFile(cells)
      
    })
  }) 
}