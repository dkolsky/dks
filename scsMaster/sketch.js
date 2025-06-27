let groups = [];

function setup() {
  let cnv = createCanvas(1200, 1200);
  cnv.parent("canvas-holder");
  setupUI();
  generateStructure();
  applyStyles();
  noLoop();
}

function draw() {
    background(255);
  
    for (let group of groups) {
      drawGroup(group);
    }
  }

  
function regenerate() {
  applyStyles();
  redraw();
}

function generateStructure() {
  groups = [];
  let groupCount = groupCountSlider.value();

  for (let i = 0; i < groupCount; i++) {
    let cx = random(width * 0.2, width * 0.8);
    let cy = random(height * 0.2, height * 0.8);
    let parentSize = random(80, 160);

    groups.push({ 
      x: cx, 
      y: cy, 
      size: parentSize, 
      shapes: [], 
      layout: "", 
      children: [] 
    });
  }
}

function newStructure() {
    generateStructure();
    applyStyles();
    redraw();
  }

  function applyStyles() {
    let userShapeChoice = shapeSelect.value();
    let layout = layoutSelect.value();
  
    for (let group of groups) {
      // Assign shape
      let groupShapes = [];
  
      if (userShapeChoice === "random") {
        let shapeOptions = ["circle", "square", "triangle"];
        let shapeCount = floor(random(1, 4));
        for (let j = 0; j < shapeCount; j++) {
          groupShapes.push(random(shapeOptions));
        }
      } else {
        groupShapes.push(userShapeChoice);
      }
      group.shapes = groupShapes;
  
      group.parentShape = random(group.shapes);
  
      // Assign layout
      group.layout = layout;
  
      // Rebuild children
      group.children = [];
      let childCount = max(1, childrenPerGroupSlider.value());
      let childLayout = childLayoutSelect.value();
      let childDistance = childDistanceSlider.value();
      let angleStart = random(TWO_PI);
      let angleSpread = radians(120);
  
      for (let j = 0; j < childCount; j++) {
        let angle;
        if (childLayout === "radial" || childLayout === "orbit") {
          angle = angleStart + map(j, 0, childCount - 1, -angleSpread/2, angleSpread/2);
        } else {
          angle = random(TWO_PI);
        }
        let radius = (childLayout === "scatter") ? random(20, childDistance) : childDistance;
        let x = group.x + cos(angle) * radius;
        let y = group.y + sin(angle) * radius;
        let size = group.size * 0.4;
        group.children.push({ x, y, size, shape: random(group.shapes) }); // ✅ put shape here correctly!
      }
    }
  }

  function drawGroup(group, alpha) {
    noStroke();
  
    fill(0, alpha * 0.08); // Shadow behind parent
    drawShape(group.x, group.y, group.size, group.parentShape);
  
    fill(0, alpha); // Main parent
    drawShape(group.x, group.y, group.size, group.parentShape);
  
    for (let child of group.children) {
      fill(0, alpha * 0.4); // Child main
      drawShape(child.x, child.y, child.size, child.shape);
  
      fill(0, alpha * 0.08); // Child shadow
      drawShape(child.x + 6, child.y + 6, child.size, child.shape);
    }
  }

function drawShape(x, y, s, type) {
  push();
  translate(x, y);
  let angleOffset = angleOffsetSlider.value();
  rotate(radians(random(-angleOffset, angleOffset)));

  if (type === "circle") {
    ellipse(0, 0, s);
  } else if (type === "square") {
    rectMode(CENTER);
    rect(0, 0, s, s);
  } else if (type === "triangle") {
    triangle(
      -s / 2, s / 2,
      0, -s / 2,
      s / 2, s / 2
    );
  }
  pop();
}