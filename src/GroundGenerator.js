import * as fs from 'fs';
const GROUND_SIZE = 16

//Edit this object whenever run script. It will generate ground objects by xml format. Then copy it and paste to file *.tmx
const ground = {
  x: 0,
  y: 432,
  x_end: 624,
  start_id: 64, // It's 'nextobjectid' in map. We will modify nextobjectid when we already added ground objects to .tmx file
  gid: 115 //is firstgid of tileset of ground
}

function generateGround(grounds, fileToWirte)
{
  const { x, y, start_id, x_end, gid } = grounds
  const numOfGround = (x_end - x) / GROUND_SIZE

  for(let index = 0; index < numOfGround; index++) {
    
    const current_x = index*GROUND_SIZE + x
    const stringline = `<object id="${start_id + index}" gid="${gid}" x="${current_x}" y="${y}" width="16" height="16"/>\n`

    setTimeout( () => 
    fs.appendFile(fileToWirte, stringline,  function (err) {
      if (err) return console.log(err);
      console.log('Appended!');
    }), index*100);

  }
}

generateGround(ground, 'ground.txt')