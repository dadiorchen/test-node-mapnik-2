const mapnik = require('mapnik');
const path = require("path");
const fs = require('fs');
const { Pool, Client } = require("pg");
const config = require("./config");


describe("", () => {

  it.skip("", () => {
    console.log("path:", path.resolve(mapnik.settings.paths.input_plugins, 'geojson.input'));
  });

  it.only("", async () => {
    console.log("ok!");
    const scaleH = 8;
    const scaleV = 4;

    // register fonts and datasource plugins
    mapnik.register_default_fonts();
    mapnik.register_default_input_plugins();

    const begin = Date.now();

    var map = new mapnik.Map(256*scaleH, 256*scaleV);
    await new Promise((res, rej) => {
      map.load('./stylesheet.xml', function(err,map) {
          if (err) throw err;
          map.zoomAll();
          var im = new mapnik.Image(256*scaleH, 256*scaleV);
          map.render(im, function(err,im) {
            if (err) throw err;
            im.encode('png', function(err,buffer) {
                if (err) throw err;
                fs.writeFile('map.png',buffer, function(err) {
                    if (err) throw err;
                    console.log('saved map image to map.png');
                    res();
                });
            });
          });
      });
    });
    console.log("took:", Date.now() - begin);
  }, 1000*60);
});

describe("db", () => {
  const path = "./trees.geojson";

  it.skip("", async () => {
    expect(config.connectionString).toMatch(/^post/);
    const pool = new Pool({ connectionString: config.connectionString });
    let firstLine = true;
    fs.writeFileSync(path,`{"type":"FeatureCollection","features":[\n` );

    let offset = 0;
    const limit = 1000;
    for(let loopLimit = 0; loopLimit < 600; loopLimit++){
      query = {
        text: `SELECT id, lon, lat FROM trees LIMIT ${limit} OFFSET ${offset}`,
        values: [],
      };
      console.log("query:", query);
      const result = await pool.query(query);
      //console.log("result:", result);
      if(result.rows.length > 0){
        for(let row of result.rows){
          expect(row).toMatchObject({
            id: expect.anything(),
            lon: expect.anything(),
            lat: expect.anything(),
          });
          fs.appendFileSync(path,`${firstLine?"":","}{"type":"Feature","geometry":{"type":"Point","coordinates":[${row.lon},${row.lat}]}}\n`);
          firstLine = false;
        }
      }else{
        console.log("quit because at the end");
        break;
      }
      offset += limit;
      console.log("offset arive:", offset);
      console.log("loopLimit arive:", loopLimit);
    }
    fs.appendFileSync(path,`]}`);
  }, 1000*60*60*2);

  it("check file", () => {
    const content = fs.readFileSync(path);
    const lines = content.toString().split(/\n/);
    console.log("lines:", lines.length);
    //for(let i = 2; i < lines.length -1; i++){
    for(let i = 2; i < lines.length -2; i++){
//,{"type":"Feature","geometry":{"type":"Point","coordinates":[36.84708723798394,-3.3529813773930073]}}
      if(!lines[i].match(/^,\{"type":"Feature","geometry":\{"type":"Point","coordinates":\[-?\d+(\.\d+)?,-?\d+(\.\d+)?\]\}\}/)){
        throw `don't match: ${lines[i]}, line: ${i}`;
      }
    }
//    JSON.parse(content.toString());
  });

  it("check file", () => {
    const content = fs.readFileSync(path);
    JSON.parse(content.toString());
  });
});



