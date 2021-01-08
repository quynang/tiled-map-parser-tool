import * as fs from 'fs';
import xml2js from 'xml2js'
const parser = new xml2js.Parser();

const INPUT_FILE_NAME = process.env.FILE_NAME

const OUT_PUT_FILE_NAME = 'objects.txt'

const BIG_BOX_GID = 100
const PIPE_GID = 101

// const objectType = {
//   '100': 'OBJECT_TYPE_BIG_BOX',
//   '101': 'OBJECT_TYPE_PIPE',
//   '111': 'OBJECT_TYPE_GOOMBA',
//   '112': 'OBJECT_TYPE_BRICK',
//   '113': 'OBJECT_TYPE_FLOATING_BRICK',
//   '114': 'OBJECT_TYPE_FLOATING_BRICK_2',
//   '115': 'OBJECT_TYPE_GROUND',
//   '116': 'OBJECT_TYPE_PIRANHA_PLANT',
//   '117': 'OBJECT_TYPE_FIRE_PIRANHA_PLANT',
//   '116': 'OBJECT_TYPE_FIRE_PIRANHA_PLANT_GREEN',
//   '119': 'OBJECT_TYPE_COIN',
//   '120': 'OBJECT_TYPE_MARIO',
//   '121': 'OBJECT_TYPE_KOOPAS',
//   '122': 'OBJECT_TYPE_PARATROPA',
//   '123': 'OBJECT_TYPE_WING_GOOMBA',
//   '124': 'OBJECT_TYPE_BREAKABLE_BRICK'
//   '125': 'OBJECT_TYPE_BLOCK_RANDOM_ITEM'
// }

export default function parseObjects() {

  fs.readFile(INPUT_FILE_NAME, function(err, data) {

    if (err) return console.log(err);
  
    parser.parseString(data, function (err, result) {
  
      if (err) return console.log(err);
      
      const objects = result.map.objectgroup[0].object
      
      objects.forEach((object, index) => {

        const { id, x, y, type, height } = object['$']

        let gid = object['$'].gid

        let y_on_codebase = y - height

        //For those objects which was create by inserting Reactangle. Y is different from object was created by inserting image. 
        if(!gid) {
          y_on_codebase = y
          switch(object['$'].name)
          {
            case 'bigbox': gid = BIG_BOX_GID; break;
            case 'pipe': gid = PIPE_GID; break;
          }
        }

        const extra_params = type ? '\t' + type.split(' ').join('\t') : ''

        const stringline = id + '\t' + gid + '\t' + x + '\t' + y_on_codebase + extra_params + '\n'
        
        setTimeout(() => {
          fs.appendFile(OUT_PUT_FILE_NAME, stringline , function (err) {
            if (err) return console.log(err);
            console.log('Appended!');
          }) 
        }, index*100);
      })

    })
  }) 
}