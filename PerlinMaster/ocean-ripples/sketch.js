// sketch.js
let contrastAmount = 0.5; // global contrast control
let contrastSlider;       // also global
let baseLayer, midLayer, boostedLayer;
let circles = [];
let boostedCircles = [];

let noiseScale = 0.005; // initial noise detail
let boostMinSlider, boostMaxSlider, numBoostedSlider, noiseScaleSlider;

function setup() {
  let cnv = createCanvas(1200, 800);
  cnv.parent('canvas-holder');
  noLoop();

  baseLayer = createGraphics(width, height);
  midLayer = createGraphics(width, height);
  boostedLayer = createGraphics(width, height);

  setupUI();
  setTimeout(() => {
  contrastAmount = contrastSlider.value(); // ensure it's initialized
  regenerateCircles();
}, 100);
}

function draw() {
  clear();
  drawBaseLayer();
  drawMidLayer();
  drawBoostedLayer();
  image(baseLayer, 0, 0);
  image(midLayer, 0, 0);
  image(boostedLayer, 0, 0);
}