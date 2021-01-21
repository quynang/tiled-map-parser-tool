import * as fs from 'fs';
import xml2js from 'xml2js'
const parser = new xml2js.Parser();

const INPUT_FILE_NAME = process.env.FILE_NAME

const OUT_PUT_FILE_NAME = 'objects.txt'

const OBJECT_TYPE_BIG_BOX_GID = 100
const OBJECT_TYPE_PIPE_GID = 101
const OBJECT_TYPE_PIPE_EXIT_GID = 102


// 'OBJECT_TYPE_BIG_BOX',
// 'OBJECT_TYPE_PIPE',
// 'OBJECT_TYPE_GOOMBA',
// 'OBJECT_TYPE_BRICK',
// 'OBJECT_TYPE_FLOATING_BRICK',
// 'OBJECT_TYPE_FLOATING_BRICK_2',
// 'OBJECT_TYPE_GROUND',
// 'OBJECT_TYPE_PIRANHA_PLANT',
// 'OBJECT_TYPE_FIRE_PIRANHA_PLANT',
// 'OBJECT_TYPE_FIRE_PIRANHA_PLANT_GREEN',
// 'OBJECT_TYPE_COIN',
// 'OBJECT_TYPE_MARIO',
// 'OBJECT_TYPE_KOOPAS',
// 'OBJECT_TYPE_PARATROPA',
// 'OBJECT_TYPE_WING_GOOMBA',
// 'OBJECT_TYPE_BREAKABLE_BRICK',
// 'OBJECT_TYPE_BLOCK_RANDOM_ITEM'

export default function parseObjects() {

  fs.readFile(INPUT_FILE_NAME, function(err, data) {

    if (err) return console.log(err);
  
    parser.parseString(data, function (err, result) {
  
      if (err) return console.log(err);
      
      const num_prefix = result.map.tileset[0]['$'].tilecount
      const objects = result.map.objectgroup[0].object
            
      objects.forEach((object, index) => {

        const { id, x, y, type, height, gid } = object['$']

        let object_type_id = gid - num_prefix

        let y_on_codebase = y - height

        //For those objects which was create by inserting Reactangle. Y is different from object was created by inserting image. 
        if(!gid) {
          y_on_codebase = y
          switch(object['$'].name)
          {
            case 'bigbox': object_type_id = OBJECT_TYPE_BIG_BOX_GID; break;
            case 'pipe': object_type_id = OBJECT_TYPE_PIPE_GID; break;
            case 'pipe_exit': object_type_id = OBJECT_TYPE_PIPE_EXIT_GID; break;
          }
        }

        const extra_params = type ? '\t' + type.split(' ').join('\t') : ''

        const stringline = id + '\t' + object_type_id + '\t' + x + '\t' + y_on_codebase + extra_params + '\n'
        
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