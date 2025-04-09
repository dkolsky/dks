const CDN_BASE = 'https://cdn.jsdelivr.net/gh/dkolsky/dks@main/dks-2025/';

let aspectRatio;
let canvasW, canvasH;

let imageGroups = [];

let lastScrollY = 0;
let scrollVelocity = 0;

let smallImages = [];

let groupData = [
  {
    name: 'triangle',
    baseStart: { xPct: 0.5, yPct: 0.62 },
    baseEnd:   { xPct: -1.25, yPct: 0 },
    images: [
      { file: 'images/triangle-base.png', offset: { xPct: 0.02, yPct: 0.01 }, z: 0 },
      { file: 'images/triangle-light.png', offset: { xPct: 0, yPct: 0.03 }, z: 2 },
      { file: 'images/triangle-dark.png', offset: { xPct: 0.02, yPct: 0.0 }, z: 1 }
    ]
  },
  {
    name: 'circle',
    baseStart: { xPct: 0.35, yPct: 0.44 },
    baseEnd:   { xPct: 0.24, yPct: 1.5 },
    images: [
      { file: 'images/circle-base.png', offset: { xPct: 0.03, yPct: 0.01 }, z: 0 },
      { file: 'images/circle-light.png', offset: { xPct: 0.01, yPct: -0.01 }, z: 2 },
      { file: 'images/circle-dark.png', offset: { xPct: 0.05, yPct: 0.04 }, z: 1 }
    ]
  },
  {
    name: 'square',
    baseStart: { xPct: 0.59, yPct: 0.26 },
    baseEnd:   { xPct: 0.72, yPct: -0.5 },
    images: [
      { file: 'images/square-base.png', offset: { xPct: 0, yPct: 0 }, z: 0 },
      { file: 'images/square-light.png', offset: { xPct: 0.0, yPct: -0.0 }, z: 2 },
      { file: 'images/square-dark.png', offset: { xPct: -0.02, yPct: -0.01 }, z: 1 }
    ]
  }
];

function preload() {
  // Load large images
  for (let group of groupData) {
    for (let img of group.images) {
      img.file = CDN_BASE + img.file;
      img.img = loadImage(
        img.file,
        () => console.log(`Loaded: ${img.file}`),
        () => console.error(`Failed to load: ${img.file}`)
      );
    }
  }

  // Load small images
  for (let i = 1; i <= 9; i++) {
    let filename = `small-set-${nf(i, 2)}-base.png`;
    let imgPath = CDN_BASE + 'images/' + filename;
    let img = loadImage(
      imgPath,
      () => console.log(`Loaded: ${imgPath}`),
      () => console.error(`Failed to load: ${imgPath}`)
    );
    smallImages.push(img);
  }
}

class ImageGroup {
  constructor(imageObjs, baseStart, baseEnd, scaleFactor = 1, zIndex = 0) {
    this.imageObjs = imageObjs;
    this.baseStart = baseStart.copy();
    this.baseEnd = baseEnd.copy();
    this.scrollOffset = 0;
    this.motionSeeds = this.imageObjs.map(() => random(1000));
    this.scaleFactor = scaleFactor;
    this.zIndex = zIndex;
  }

  update(scrollY) {
    this.scrollOffset = -scrollY * 0.05;
  }

  display(scrollVelocity) {
    push();
    translate(0, this.scrollOffset);
    imageMode(CENTER);

    let scaleFactor = getScaleFactor() * this.scaleFactor;
    let rawScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    let scrollPct = constrain(easeInOutQuad(rawScroll), 0, 1);

    let baseX = lerp(this.baseStart.x, this.baseEnd.x, scrollPct) * canvasW;
    let baseY = lerp(this.baseStart.y, this.baseEnd.y, scrollPct) * canvasH;
    let basePos = createVector(baseX, baseY);

    let sortedImages = [...this.imageObjs].sort((a, b) => a.z - b.z);

    if (this.scaleFactor < 1) {
      let opacity = map(scrollPct, 0, 1, 120, 0);
      tint(120, opacity);
    } else {
      noTint();
    }

    for (let i = 0; i < sortedImages.length; i++) {
      let imgObj = sortedImages[i];
      let xOffset = imgObj.offset.xPct * canvasW;
      let yOffset = imgObj.offset.yPct * canvasH;
      let pos = p5.Vector.add(basePos, createVector(xOffset, yOffset));

      let t = millis() / 1000;
      let seed = this.motionSeeds[i];
      let motionIntensity = constrain(scrollVelocity / 5, 0, 1);

      let xWiggle = sin(t + seed) * 5 * motionIntensity;
      let yWiggle = cos(t + seed * 2) * 4 * motionIntensity;

      pos.add(xWiggle, yWiggle);

      drawingContext.shadowColor = 'rgba(0, 0, 0, 0.27)';
      drawingContext.shadowBlur = 15;
      drawingContext.shadowOffsetX = 15;
      drawingContext.shadowOffsetY = 5;

      image(
        imgObj.img,
        pos.x,
        pos.y,
        imgObj.img.width * scaleFactor,
        imgObj.img.height * scaleFactor
      );
    }

    pop();
  }
}

function setup() {
  updateCanvasSize();

function setup() {
  updateCanvasSize();

  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('p5-container'); // 👈 This tells p5 where to insert the canvas

  cnv.style('display', 'block');
  cnv.style('margin', '0 auto');
}


  for (let group of groupData) {
    let start = createVector(group.baseStart.xPct, group.baseStart.yPct);
    let endX = random() < 0.5 ? random(-1.2, -0.2) : random(1.2, 2);
    let endY = random() < 0.5 ? random(-1.2, -0.2) : random(1.2, 2);
    let end = createVector(endX, endY);

    imageGroups.push(new ImageGroup(group.images, start, end, 1, random(100)));
  }

  let numSmallGroups = 4;
  for (let i = 0; i < numSmallGroups; i++) {
    let randomImg = random(smallImages);
    let startX = random(0.15, 0.85);
    let startY = random(0.15, 0.85);
    let start = createVector(startX, startY);

    let endX = constrain(startX + random(-0.8, 0.8), -1, 1);
    let endY = constrain(startY + random(-0.8, 0.8), -1, 1);
    let end = createVector(endX, endY);

    let imgArray = [{ img: randomImg, offset: { xPct: 0, yPct: 0 }, z: 0 }];
    imageGroups.push(new ImageGroup(imgArray, start, end, 0.8, random(100)));
  }
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getScaleFactor() {
  return constrain(map(canvasW, 320, 1920, 0.3, 0.5), 0.1, 0.2);
}

function draw() {
  background('#d9d9d9');

  let currentScrollY = window.scrollY;
  scrollVelocity = abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;

  imageGroups.sort((a, b) => a.zIndex - b.zIndex);

  for (let group of imageGroups) {
    group.update(window.scrollY);
    group.display(scrollVelocity);
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
