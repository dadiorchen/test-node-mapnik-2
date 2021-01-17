var mapnik = require('mapnik');
const path = require("path");
var fs = require('fs');

describe("", () => {

  it.skip("", () => {
    console.log("path:", path.resolve(mapnik.settings.paths.input_plugins, 'geojson.input'));
  });

  it("", async () => {
    console.log("ok!");

    // register fonts and datasource plugins
    mapnik.register_default_fonts();
    mapnik.register_default_input_plugins();

    var map = new mapnik.Map(256, 256);
    await new Promise((res, rej) => {
      map.load('./stylesheet.xml', function(err,map) {
          if (err) throw err;
          map.zoomAll();
          var im = new mapnik.Image(256, 256);
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
  }, 1000*60);
});
