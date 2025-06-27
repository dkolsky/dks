/* global SVG */
let hexes = [];
let cols, rows;
let hexRadius = 30;
let showGridCheckbox;
let showGrid = true;
let valueMode = "snake"; // or "radial"

let shape1 = 'circle', shape2 = 'square', shape3 = 'triangle';

let shape1Index = 0, shape2Index = 1, shape3Index = 2;
let shape1Size = 80, shape2Size = 80, shape3Size = 80;
let shape1Rotation = 0, shape2Rotation = 0, shape3Rotation = 0;

function setup() {
  let cnv = createCanvas(1200, 900);
  cnv.parent('canvas-holder');
  cols = floor(width / (hexRadius * 1.5));
  rows = floor(height / (hexRadius * sqrt(3)));
  angleMode(DEGREES);
  noLoop();

  let uiPanel = select('#ui-panel');
  let exportBtn = createButton('Export SVG').parent(uiPanel);
  exportBtn.mousePressed(exportAsSVG);

  let controlRow = createDiv().class('control-row').parent(uiPanel);
  let gridControls = createDiv().parent(controlRow);

  showGridCheckbox = createCheckbox('Show grid', true).parent(gridControls);
  showGridCheckbox.changed(() => {
    showGrid = showGridCheckbox.checked();
    redraw();
  });

  let modeSelector = createSelect().parent(gridControls);
  modeSelector.option('snake');
  modeSelector.option('radial');
  modeSelector.selected('snake');
  modeSelector.changed(() => {
    valueMode = modeSelector.value();
    cols = floor(width / (hexRadius * 1.5));
    rows = floor(height / (hexRadius * sqrt(3)));
    createHexGrid(cols, rows, hexRadius);
    redraw();
  });

  let shapeRow = createDiv().class('control-row').parent(uiPanel);

  let shape1Div = createDiv().class('shape-block').parent(shapeRow);
  createSpan('Shape 1 Type').parent(shape1Div);
  let shape1Selector = createSelect().parent(shape1Div);
  shape1Selector.option('circle');
  shape1Selector.option('square');
  shape1Selector.option('triangle');
  shape1Selector.selected('circle');
  shape1Selector.changed(() => { shape1 = shape1Selector.value(); redraw(); });

  createSpan('Shape 1 Index').parent(shape1Div);
  let shape1ValueInput = createInput('0', 'number').parent(shape1Div);
  shape1ValueInput.input(() => { shape1Index = int(shape1ValueInput.value()); redraw(); });

  createSpan('Shape 1 Size (%)').parent(shape1Div);
  let shape1SizeInput = createInput('80', 'number').parent(shape1Div);
  shape1SizeInput.input(() => { shape1Size = float(shape1SizeInput.value()); redraw(); });

  createSpan('Shape 1 Rotation (°)').parent(shape1Div);
  let shape1RotationSlider = createSlider(0, 360, 0).parent(shape1Div);
  shape1RotationSlider.input(() => { shape1Rotation = shape1RotationSlider.value(); redraw(); });

  let shape2Div = createDiv().class('shape-block').parent(shapeRow);
  createSpan('Shape 2 Type').parent(shape2Div);
  let shape2Selector = createSelect().parent(shape2Div);
  shape2Selector.option('circle');
  shape2Selector.option('square');
  shape2Selector.option('triangle');
  shape2Selector.selected('square');
  shape2Selector.changed(() => { shape2 = shape2Selector.value(); redraw(); });

  createSpan('Shape 2 Index').parent(shape2Div);
  let shape2ValueInput = createInput('1', 'number').parent(shape2Div);
  shape2ValueInput.input(() => { shape2Index = int(shape2ValueInput.value()); redraw(); });

  createSpan('Shape 2 Size (%)').parent(shape2Div);
  let shape2SizeInput = createInput('80', 'number').parent(shape2Div);
  shape2SizeInput.input(() => { shape2Size = float(shape2SizeInput.value()); redraw(); });

  createSpan('Shape 2 Rotation (°)').parent(shape2Div);
  let shape2RotationSlider = createSlider(0, 360, 0).parent(shape2Div);
  shape2RotationSlider.input(() => { shape2Rotation = shape2RotationSlider.value(); redraw(); });

  let shape3Div = createDiv().class('shape-block').parent(shapeRow);
  createSpan('Shape 3 Type').parent(shape3Div);
  let shape3Selector = createSelect().parent(shape3Div);
  shape3Selector.option('circle');
  shape3Selector.option('square');
  shape3Selector.option('triangle');
  shape3Selector.selected('triangle');
  shape3Selector.changed(() => { shape3 = shape3Selector.value(); redraw(); });

  createSpan('Shape 3 Index').parent(shape3Div);
  let shape3ValueInput = createInput('2', 'number').parent(shape3Div);
  shape3ValueInput.input(() => { shape3Index = int(shape3ValueInput.value()); redraw(); });

  createSpan('Shape 3 Size (%)').parent(shape3Div);
  let shape3SizeInput = createInput('80', 'number').parent(shape3Div);
  shape3SizeInput.input(() => { shape3Size = float(shape3SizeInput.value()); redraw(); });

  createSpan('Shape 3 Rotation (°)').parent(shape3Div);
  let shape3RotationSlider = createSlider(0, 360, 0).parent(shape3Div);
  shape3RotationSlider.input(() => { shape3Rotation = shape3RotationSlider.value(); redraw(); });

  createHexGrid(cols, rows, hexRadius);
}

function draw() {
  background(255);
  noFill();
  stroke(0, 100); // Light stroke

  if (showGrid) {
    for (let h of hexes) {
      drawHex(h.x, h.y, hexRadius);
    }
  }

  let sorted = [...hexes].sort((a, b) => a.value - b.value);
  if (
    sorted[shape1Index] &&
    sorted[shape2Index] &&
    sorted[shape3Index]
  ) {
    drawShape(shape1, sorted[shape1Index].x, sorted[shape1Index].y, hexRadius * (shape1Size / 100), shape1Rotation);
    drawShape(shape2, sorted[shape2Index].x, sorted[shape2Index].y, hexRadius * (shape2Size / 100), shape2Rotation);
    drawShape(shape3, sorted[shape3Index].x, sorted[shape3Index].y, hexRadius * (shape3Size / 100), shape3Rotation);
  }
}

function createHexGrid(cols, rows, r) {
  hexes = [];
  let dx = r * 1.5;
  let dy = sqrt(3) * r;

  let cx = width / 2;
  let cy = height / 2;

  let offsetX = width / 2 - ((cols - 1) * dx) / 2;
  let offsetY = height / 2 - ((rows - 1) * dy + dy / 2) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * dx + offsetX;
      let y = row * dy + offsetY;
      if (col % 2 === 1) y += dy / 2;

      let value;
      if (valueMode === "snake") {
        value = row * cols + (row % 2 === 0 ? col : cols - 1 - col);
      } else if (valueMode === "radial") {
        value = dist(x, y, cx, cy);
      } else {
        value = row * cols + col;
      }

      hexes.push({ x, y, value });
    }
  }
}

function drawHex(x, y, r) {
  beginShape();
  for (let a = 0; a < 360; a += 60) {
    let sx = x + cos(a) * r;
    let sy = y + sin(a) * r;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawShape(shape, x, y, size, rotation) {
  push();
  translate(x, y);
  rotate(rotation);
  noStroke();
  fill(0, 100, 200, 150);

  if (shape === 'circle') {
    ellipse(0, 0, size);
  } else if (shape === 'square') {
    rectMode(CENTER);
    rect(0, 0, size, size);
  } else if (shape === 'triangle') {
    let h = size * sqrt(3) / 2;
    triangle(
      -size / 2, h / 2,
      size / 2, h / 2,
      0, -h / 2
    );
  }
  pop();
}

function exportAsSVG() {
  console.log("Exporting...");

  let sorted = [...hexes].sort((a, b) => a.value - b.value);
  if (
    !sorted[shape1Index] ||
    !sorted[shape2Index] ||
    !sorted[shape3Index]
  ) {
    console.warn("Not enough shapes to export.");
    return;
  }

  const svgHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
  const svgOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  const svgClose = `</svg>`;
  const shapeStyle = `fill="rgb(0,100,200)" fill-opacity="0.6" stroke="none"`;

  function shapeToSVG(shape, x, y, size, rotation) {
    let transform = `translate(${x},${y}) rotate(${rotation})`;
    if (shape === 'circle') {
      return `<circle cx="0" cy="0" r="${size / 2}" transform="${transform}" ${shapeStyle} />`;
    } else if (shape === 'square') {
      let s = size;
      return `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" transform="${transform}" ${shapeStyle} />`;
    } else if (shape === 'triangle') {
      let h = size * Math.sqrt(3) / 2;
      return `<polygon points="${-size/2},${h/2} ${size/2},${h/2} 0,${-h/2}" transform="${transform}" ${shapeStyle} />`;
    }
    return '';
  }

  const shapes = [
    shapeToSVG(shape1, sorted[shape1Index].x, sorted[shape1Index].y, hexRadius * (shape1Size / 100), shape1Rotation),
    shapeToSVG(shape2, sorted[shape2Index].x, sorted[shape2Index].y, hexRadius * (shape2Size / 100), shape2Rotation),
    shapeToSVG(shape3, sorted[shape3Index].x, sorted[shape3Index].y, hexRadius * (shape3Size / 100), shape3Rotation),
  ];

  const fullSVG = svgHeader + svgOpen + shapes.join("\n") + "\n" + svgClose;
  const blob = new Blob([fullSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hexgrid.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function drawShapeOnGraphics(g, shape, x, y, size, rotation) {
  g.push();
  g.translate(x, y);
  g.rotate(rotation);
  g.noStroke();
  g.fill(0, 100, 200, 150);

  if (shape === 'circle') {
    g.ellipse(0, 0, size);
  } else if (shape === 'square') {
    g.rectMode(CENTER);
    g.rect(0, 0, size, size);
  } else if (shape === 'triangle') {
    let h = size * sqrt(3) / 2;
    g.triangle(
      -size / 2, h / 2,
      size / 2, h / 2,
      0, -h / 2
    );
  }
  g.pop();
}
// Draw a hexagon on a graphics context (e.g. for SVG export)
function drawHexOnGraphics(g, x, y, r) {
  g.beginShape();
  for (let a = 0; a < 360; a += 60) {
    let radians = (a * Math.PI) / 180;
    let sx = x + Math.cos(radians) * r;
    let sy = y + Math.sin(radians) * r;
    g.vertex(sx, sy);
  }
  g.endShape(CLOSE);
}