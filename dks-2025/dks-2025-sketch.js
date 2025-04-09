let aspectRatio;
let canvasW, canvasH;

let imageGroups = [];

let groupData = [
  {
    name: 'triangle',
    images: [
      { file: 'images/triangle-base.png', offset: { xPct: 0, yPct: 0 } },
      { file: 'images/triangle-light.png', offset: { xPct: -0.05, yPct: -0.03 } },
      { file: 'images/triangle-dark.png', offset: { xPct: 0.04, yPct: 0.02 } }
    ]
  },
  {
    name: 'circle',
    images: [
      { file: 'images/circle-base.png', offset: { xPct: 0, yPct: 0 } },
      { file: 'images/circle-light.png', offset: { xPct: -0.06, yPct: 0.04 } },
      { file: 'images/circle-dark.png', offset: { xPct: 0.05, yPct: -0.05 } }
    ]
  },
  {
    name: 'square',
    images: [
      { file: 'images/square-base.png', offset: { xPct: 0, yPct: 0 } },
      { file: 'images/square-light.png', offset: { xPct: 0.03, yPct: 0.06 } },
      { file: 'images/square-dark.png', offset: { xPct: -0.08, yPct: -0.02 } }
    ]
  }
];

function preload() {
  // Load all images
  for (let group of groupData) {
    for (let img of group.images) {
      img.img = loadImage(img.file);
    }
  }
}

function setup() {
  updateCanvasSize();
  createCanvas(canvasW, canvasH);

  // Create one main group for each type (evenly spaced horizontally)
  for (let i = 0; i < groupData.length; i++) {
    let g = groupData[i];
    let x = (i + 1) * canvasW / 4;
    let y = canvasH / 2;
    imageGroups.push(new ImageGroup(g.images, createVector(x, y)));
  }
}

function draw() {
  background(20);

  let scrollY = window.scrollY;

  for (let group of imageGroups) {
    group.update(scrollY);
    group.display();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasW, canvasH);
}

function updateCanvasSize() {
  let w = windowWidth;
  let h = windowHeight;
  let isMobile = w <= 768;

  aspectRatio = isMobile ? 1 : 16 / 9;
  canvasW = w;
  canvasH = w / aspectRatio;

  if (canvasH > h) {
    canvasH = h;
    canvasW = h * aspectRatio;
  }
}

class ImageGroup {
  constructor(imageObjs, basePos) {
    this.imageObjs = imageObjs;
    this.basePos = basePos.copy();
    this.scrollOffset = 0;
  }

  update(scrollY) {
    this.scrollOffset = scrollY * 0.3;
  }

  display() {
    push();
    translate(0, this.scrollOffset);

    for (let imgObj of this.imageObjs) {
      let xOffset = imgObj.offset.xPct * canvasW;
      let yOffset = imgObj.offset.yPct * canvasH;
      let pos = p5.Vector.add(this.basePos, createVector(xOffset, yOffset));
      image(imgObj.img, pos.x, pos.y);
    }

    pop();
  }
}
