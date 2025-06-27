let bgImg;
let gui;
let params = {
  numShapes: 50,
  seed: 123,
  contrastThreshold: 5,
  letForeground: true,
  sampleFromSubject: true,
  useFixedColor: false,
  useEyedropper: false,
  shapeColor: [255, 0, 0]
};
let palette = [
  [3, 199, 120], [24, 24, 24], [94, 126, 193], [95, 237, 179],
  [119, 120, 121], [162, 188, 247], [167, 167, 167], [200, 247, 229],
  [204, 204, 204], [214, 225, 245], [226, 226, 226], [230, 236, 250],
  [235, 250, 245], [248, 248, 248], [249, 195, 119], [249, 226, 119],
  [254, 127, 32], [255, 207, 1], [255, 223, 176], [255, 240, 217],
  [255, 241, 176], [255, 248, 217]
];
let shapes = [];
let contrastMap = [];

function preload() {
  bgImg = loadImage('assets/bg.png'); // Replace with your actual image file
}

function setup() {
  createCanvas(1080, 1080);
  noStroke();
  imageMode(CORNER);
  gui = new dat.GUI();
  gui.add(params, 'numShapes', 10, 300, 1).onChange(generateShapes);
  gui.add(params, 'seed').onChange(generateShapes);
  gui.add(params, 'contrastThreshold', 0, 255).onChange(() => {
    computeContrastMap();
    generateShapes();
  });
  gui.add(params, 'letForeground').onChange(generateShapes);
  gui.add(params, 'sampleFromSubject').onChange(generateShapes);
  let fixedColorController = gui.add(params, 'useFixedColor').onChange(() => {
    generateShapes();
    updateEyedropperVisibility();
  });
  let eyedropperController = gui.add(params, 'useEyedropper').onChange(() => {
    generateShapes();
    updateEyedropperVisibility();
  });
  gui.addColor(params, 'shapeColor').onChange(generateShapes);
  updateEyedropperVisibility();
  computeContrastMap();
  generateShapes();
}

function updateEyedropperVisibility() {
  // Disable the color picker if useEyedropper is true
  if (params.useEyedropper && params.useFixedColor) {
    gui.__controllers.forEach(c => {
      if (c.property === 'shapeColor') {
        c.domElement.parentElement.style.pointerEvents = 'auto';
        c.domElement.parentElement.style.opacity = '0.5';
      }
    });
  } else {
    gui.__controllers.forEach(c => {
      if (c.property === 'shapeColor') {
        c.domElement.parentElement.style.pointerEvents = 'auto';
        c.domElement.parentElement.style.opacity = '1';
      }
    });
  }
}

function draw() {
  background(255);
  image(bgImg, 0, 0, width, height);
  if (params.useFixedColor && params.useEyedropper) {
    cursor(CROSS);
  } else {
    cursor(ARROW);
  }
  for (let s of shapes) {
    push();
    translate(s.x, s.y);
    rotate(radians(s.angle));
    fill(s.color);
    noStroke();
    if (s.type === 'square') {
      rectMode(CENTER);
      rect(0, 0, s.size, s.size);
    } else if (s.type === 'triangle') {
      let h = s.size * Math.sqrt(3) / 2;
      triangle(
        0, -h / 2,
        -s.size / 2, h / 2,
        s.size / 2, h / 2
      );
    } else if (s.type === 'circle') {
      ellipseMode(CENTER);
      ellipse(0, 0, s.size, s.size);
    }
    pop();
  }
}

function mousePressed() {
  if (params.useFixedColor && params.useEyedropper) {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
      let c = bgImg.get(mouseX, mouseY);
      if (c.length >= 3) {
        params.shapeColor = c.slice(0, 3);
        generateShapes();
      }
    }
  }
}

function computeContrastMap() {
  // Make a 2D array for faster lookup
  contrastMap = new Array(width).fill().map(() => new Array(height).fill(0));
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let c = brightness(bgImg.get(x, y));
      let neighbors = [
        brightness(bgImg.get(x - 1, y)),
        brightness(bgImg.get(x + 1, y)),
        brightness(bgImg.get(x, y - 1)),
        brightness(bgImg.get(x, y + 1))
      ];
      let avgDiff = neighbors.reduce((sum, b) => sum + abs(c - b), 0) / neighbors.length;
      contrastMap[x][y] = avgDiff;
    }
  }
}

function generateShapes() {
  if (!bgImg || !bgImg.width) return;
  bgImg.loadPixels();
  randomSeed(params.seed);
  shapes = [];

  let shapeTypes = ['square', 'triangle', 'circle'];
  let shapeTypeIndex = 0;

  let attempts = 0;
  while (shapes.length < params.numShapes && attempts < params.numShapes * 10) {
    let x = int(random(1, width - 1));
    let y = int(random(1, height - 1));
    let contrast = contrastMap[x] && contrastMap[x][y];
    if (contrast === undefined) {
      attempts++;
      continue;
    }
    let valid = params.letForeground ? contrast >= params.contrastThreshold : contrast < params.contrastThreshold;
    if (!valid) {
      attempts++;
      continue;
    }

    let type = shapeTypes[shapeTypeIndex % shapeTypes.length];
    shapeTypeIndex++;

    let size = random(width * 0.015, width * 0.08);
    let angle = type === 'square' ? random(0, 90) : random(0, 120);

    let c;
    if (params.useFixedColor) {
      c = params.shapeColor;
    } else {
      c = bgImg.get(x, y);
    }
    if (c.length < 3) c = [128, 128, 128];
    shapes.push({ x, y, size, type, angle, color: color(...c) });
    attempts++;
  }
}