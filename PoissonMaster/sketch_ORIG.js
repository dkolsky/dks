// sketch.js
let img, imgResized;
let invertColors = false;
let numBoosted = 0; // number of boosted dots
let numBoostedSlider; // <-- for picking how many dots get boosted
let boostMinSlider, boostMaxSlider;
let baseLayer, boostLayer;
let circles = [];
let boostedCircles = [];

function preload() {
    img = loadImage('assets/image_fx (5).jpg'); // make sure you have an image file there
      }


function setup() {
let cnv = createCanvas(1200, 2400); // or set based on image
cnv.parent('canvas-holder');
noLoop();

// Resize image to fit canvas width while keeping proportions
let scale = width / img.width;
let newHeight = img.height * scale;
img.resize(width, newHeight);

baseLayer = createGraphics(width, height);
boostLayer = createGraphics(width, height);


setupUI();

setTimeout(regenerateCircles, 50); // small delay so sliders exist
}
    
function draw() {
  background(255); // Always white background

  noStroke();

  fill(0); // Always black dots
  for (let c of circles) {
    ellipse(c.x, c.y, c.size);
  }

  fill(255, 0, 0); // Red for boosted dots
  for (let bc of boostedCircles) {
    ellipse(bc.x, bc.y, bc.size);
  }
}
  
  function drawBoostLayer() {
    boostLayer.clear();
    boostLayer.noStroke();
    boostLayer.fill(invertColors ? 100 : 125);
  
    for (let c of boostedCircles) {
      boostLayer.ellipse(c.x, c.y, c.size);
    }
  }

  function regenerateCircles() {
    circles = [];
    boostedCircles = [];
  
    img.loadPixels(); // Make sure pixels are ready!
  
    let poissonSpacing = dotSpacingSlider.value();
    let tries = 30;
  
    let points = [];
    for (let y = 0; y < img.height; y += poissonSpacing) {
      for (let x = 0; x < img.width; x += poissonSpacing) {
        let jitterX = random(-poissonSpacing / 2, poissonSpacing / 2);
        let jitterY = random(-poissonSpacing / 2, poissonSpacing / 2);
        points.push([x + jitterX, y + jitterY]);
      }
    }
  
    for (let p of points) {
      let x = p[0];
      let y = p[1];
  
      let ix = constrain(floor(x), 0, img.width - 1);
      let iy = constrain(floor(y), 0, img.height - 1);
  
      let index = (ix + iy * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let brightnessValue = (r + g + b) / 3;
  
      let brightnessNormalized = brightnessValue / 255; // from 0 to 1
      let adjustedBrightness = pow(brightnessNormalized, 2); // bias toward white

      if (invertColors) {
      adjustedBrightness = 1 - adjustedBrightness; // 💥 invert brightness!
      }

      let maxDotSize = dotSizeSlider.value();
      let size = map(adjustedBrightness, 0, 1, maxDotSize * 0.5, 0);
  
      circles.push({ x: x, y: y, size: size });
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
      let minBoost = minBoostSlider.value();
      let maxBoost = maxBoostSlider.value();
      let scale = random(minBoost, maxBoost);
      circle.size = circle.originalSize * scale;
      boostedCircles.push(circle);
    }
  
    redraw();
  }

  function toggleInvert() {
    invertColors = !invertColors;
    regenerateCircles(); // <- Rebuild circles with the new size logic
  }

  function exportBaseSVG() {
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  
    for (let c of circles) {
      if (!boostedCircles.includes(c) && c.size > 0.75) { // ✨ skip super small dots
        svgContent += `<circle cx="${c.x}" cy="${c.y}" r="${c.size/2}" fill="black" />\n`;
      }
    }
  
    svgContent += `</svg>`;
  
    let blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    let url = URL.createObjectURL(blob);
  
    let a = createA(url, 'base-circles.svg');
    a.attribute('download', 'base-circles.svg');
    a.hide();
    a.elt.click();
    URL.revokeObjectURL(url);
  }
  
  function exportBoostedSVG() {
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  
    for (let c of boostedCircles) {
      if (c.size > 0.75) {
        svgContent += `<circle cx="${c.x}" cy="${c.y}" r="${c.size/2}" fill="red" />\n`; 
      svgContent += `<circle cx="${c.x}" cy="${c.y}" r="${c.size/2}" fill="red" />\n`;
    }
  }
  
    svgContent += `</svg>`;
  
    let blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    let url = URL.createObjectURL(blob);
  
    let a = createA(url, 'boosted-circles.svg');
    a.attribute('download', 'boosted-circles.svg');
    a.hide();
    a.elt.click();
    URL.revokeObjectURL(url);
  }