// Geometric Abstraction Generator with GUI
// Version 1.1

let img;
let gui;
let recordedShapes = [];
let params = {
  shapeCount: 3000,
  threshold: 127,
  invert: false,
  allowCircles: true,
  allowSquares: true,
  allowTriangles: true,
  minSize: 4,
  maxSize: 10,
  regenerate: () => redraw()
};

let positions = [];

function preload() {
  img = loadImage('assets/CR-11.jpg', 
    () => console.log('Image loaded successfully'),
    () => console.error('Failed to load image')
  );
}

function setup() {
  let maxWidth = 800;
  let maxHeight = 800;
  let scale = min(maxWidth / img.width, maxHeight / img.height);
  let canvasWidth = int(img.width * scale);
  let canvasHeight = int(img.height * scale);
  createCanvas(canvasWidth, canvasHeight);
  imageMode(CENTER);
  noLoop();
  setupGUI();
}

function draw() {
  background(255);
  img.resize(width, 0);
  img.filter(GRAY);
  img.loadPixels();

  positions = [];
  recordedShapes = [];

  // Sample pixels based on threshold and inversion
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let brightness = img.pixels[index];
      let isDark = brightness < params.threshold;
      if ((params.invert && !isDark) || (!params.invert && isDark)) {
        positions.push({ x, y });
      }
    }
  }

  let shapeTypes = [];
  if (params.allowCircles) shapeTypes.push('circle');
  if (params.allowSquares) shapeTypes.push('square');
  if (params.allowTriangles) shapeTypes.push('triangle');

  shuffle(positions, true);
  for (let i = 0; i < min(params.shapeCount, positions.length); i++) {
    let { x, y } = positions[i];
    let s = random(params.minSize, params.maxSize);
    let angle = random(TWO_PI);
    let shapeType = random(shapeTypes);

    push();
    translate(x, y);
    rotate(angle);
    noStroke();
    fill(0);
    drawShape(shapeType, s);
    pop();

    recordedShapes.push({ x, y, s, angle, shapeType });
  }
}

function drawShape(type, s) {
  if (type === 'circle') {
    ellipse(0, 0, s * 2);
  } else if (type === 'square') {
    rectMode(CENTER);
    rect(0, 0, s * 2, s * 2);
  } else if (type === 'triangle') {
    triangle(0, -s, -s, s, s, s);
  }
}

function setupGUI() {
  gui = createGui('Settings');
  gui.show(); // Ensure it displays

  sliderRange(1, 3000, 1);
  sliderRange(0, 255, 1);
  sliderRange(1, 20, 1);

  gui.addObject(params);

  let regenButton = createButton('Regenerate');
  regenButton.position(10, height + 10);
  regenButton.mousePressed(() => redraw());

  let exportButton = createButton('Export SVG');
  exportButton.position(120, height + 10);
  exportButton.mousePressed(() => saveAsSVG());
}

function keyPressed() {
  if (key === 's') {
    saveCanvas('geometric_abstraction', 'png');
  } else if (key === 'v') {
    saveAsSVG();
  }
}

function saveAsSVG() {
  let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("width", width);
  svgElement.setAttribute("height", height);
  svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);

  for (let shape of recordedShapes) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${shape.x},${shape.y}) rotate(${degrees(shape.angle)})`);
    let elem;
    if (shape.shapeType === "circle") {
      elem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      elem.setAttribute("r", shape.s);
      elem.setAttribute("cx", 0);
      elem.setAttribute("cy", 0);
    } else if (shape.shapeType === "square") {
      elem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      elem.setAttribute("x", -shape.s);
      elem.setAttribute("y", -shape.s);
      elem.setAttribute("width", shape.s * 2);
      elem.setAttribute("height", shape.s * 2);
    } else if (shape.shapeType === "triangle") {
      elem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      let points = `0,-${shape.s} -${shape.s},${shape.s} ${shape.s},${shape.s}`;
      elem.setAttribute("points", points);
    }
    elem.setAttribute("fill", "black");
    g.appendChild(elem);
    svgElement.appendChild(g);
  }

  let serializer = new XMLSerializer();
  let svgBlob = new Blob([serializer.serializeToString(svgElement)], {type: "image/svg+xml"});
  let url = URL.createObjectURL(svgBlob);
  let link = document.createElement("a");
  link.href = url;
  link.download = "geometric_abstraction.svg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
