const sphericalMercator = require("./sphericalmercator");

describe("", () => {

  it.only("", () => {
    console.log("sm:", sphericalMercator);
    const bbox = sphericalMercator.xyz_to_envelope(0, 0, 2, false);
    console.log("bbox:", bbox);
    const pl = sphericalMercator.ll_to_px([0,0], 4);
    console.log("pl:", pl);
  });
});
