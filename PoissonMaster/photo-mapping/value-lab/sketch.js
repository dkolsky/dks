// sketch.js
let numBoosted = 0; // number of boosted dots
let boostMinSlider, boostMaxSlider;
let baseLayer, boostLayer;
let circles = [];
let boostedCircles = [];

function preload() {
    img = loadImage('assets/DK_bw.jpg'); // make sure you have an image file there
      }


function setup() {
let cnv = createCanvas(1200, 800); // or set based on image
cnv.parent('canvas-holder');
noLoop();

baseLayer = createGraphics(width, height);
boostLayer = createGraphics(width, height);

setupUI(); // create sliders/buttons FIRST

// 👉 Delay regenerating circles until after UI is ready
setTimeout(regenerateCircles, 50); // small delay so sliders exist
}
    

function draw() {
  drawBaseLayer();
  drawBoostLayer();
  clear(); // clear main canvas
  image(baseLayer, 0, 0);
  image(boostLayer, 0, 0);
}
function drawBaseLayer() {
    baseLayer.clear();
    baseLayer.noStroke();
    baseLayer.fill(0); // 🖤 <--- Fill black (or whatever color you want)
  
    for (let c of circles) {
      if (!boostedCircles.includes(c)) {
        baseLayer.ellipse(c.x, c.y, c.size);
      }
    }
  }
  
  function drawBoostLayer() {
    boostLayer.clear();
    boostLayer.noStroke();
    boostLayer.fill(0); // 🖤 <--- Also black fill for boosted dots
  
    for (let c of boostedCircles) {
      boostLayer.ellipse(c.x, c.y, c.size);
    }
  }

function regenerateCircles() {
    circles = [];
    boostedCircles = [];
  
    img.loadPixels(); // Make sure pixels are ready!
  
    for (let y = 0; y < img.height; y += 10) {
      for (let x = 0; x < img.width; x += 10) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];
        let brightnessValue = (r + g + b) / 3;
  
        // Map brightness to size
        let size = map(brightnessValue, 0, 255, 12, 2);
  
        circles.push({ x: x, y: y, size: size });
      }
    }
  
    // Boost some circles randomly
    let numBoosted = numBoostedSlider.value();
    for (let i = 0; i < numBoosted; i++) {
      let index = floor(random(circles.length));
      let minBoost = boostMinSlider.value();
      let maxBoost = boostMaxSlider.value();
      circles[index].size *= random(minBoost, maxBoost);
      boostedCircles.push(circles[index]);
    }
  
    redraw();
  }
  function regenerateBoostedCircles() {
    // Reset every circle's size first
    for (let c of circles) {
      if (c.originalSize) {
        c.size = c.originalSize;
      }
    }
  
    boostedCircles = [];
  
    let numBoosted = numBoostedSlider.value();
    for (let i = 0; i < numBoosted; i++) {
      let index = floor(random(circles.length));
      let circle = circles[index];
  
      circle.originalSize = circle.originalSize || circle.size; // remember original
      let minBoost = boostMinSlider.value();
      let maxBoost = boostMaxSlider.value();
      let scale = random(minBoost, maxBoost);
      circle.size = circle.originalSize * scale;
      boostedCircles.push(circle);
    }
  
    redraw();
  }