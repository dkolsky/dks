let shapes = [];
let current = [];
let next = [];
let t = 0;
let state = 0; // 0 = circle→square, 1 = square→triangle, 2 = triangle→circle
let totalFrames = 180;
let numVertices = 60;

let capturer;
let recording = false;

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  
  shapes = [
    makeCircle(numVertices, 200),
    makeSquare(numVertices, 200),
    makeTriangle(numVertices, 200)
  ];
  
  current = shapes[0].slice();
  next = shapes[1].slice();
  
  // Uncomment to enable GIF capture (requires CCapture library)
  // capturer = new CCapture({ format: 'gif', workersPath: '', framerate: 60 });
  // capturer.start();
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < numVertices; i++) {
    let x = lerp(current[i].x, next[i].x, t);
    let y = lerp(current[i].y, next[i].y, t);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  t += 1 / (totalFrames / 3); // Each morph lasts 1/3 of the loop
  
  if (t >= 1) {
    t = 0;
    state = (state + 1) % 3;
    current = next.slice();
    next = shapes[(state + 1) % 3].slice();
  }

  // If using gif export
  // if (recording) capturer.capture(canvas);
  // if (frameCount === totalFrames) {
  //   noLoop();
  //   capturer.stop();
  //   capturer.save();
  // }
}

function makeCircle(n, r) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    let angle = TWO_PI * i / n;
    arr.push(createVector(cos(angle) * r, sin(angle) * r));
  }
  return arr;
}

function makeSquare(n, r) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    let p = i / n;
    let x, y;
    if (p < 0.25) {
      x = lerp(-r, r, p / 0.25);
      y = -r;
    } else if (p < 0.5) {
      x = r;
      y = lerp(-r, r, (p - 0.25) / 0.25);
    } else if (p < 0.75) {
      x = lerp(r, -r, (p - 0.5) / 0.25);
      y = r;
    } else {
      x = -r;
      y = lerp(r, -r, (p - 0.75) / 0.25);
    }
    arr.push(createVector(x, y));
  }
  return arr;
}

function makeTriangle(n, r) {
  let arr = [];
  let angles = [PI / 2, PI / 2 + TWO_PI / 3, PI / 2 + 2 * TWO_PI / 3];
  let vertices = angles.map(a => createVector(cos(a) * r, sin(a) * r));
  for (let i = 0; i < n; i++) {
    let p = i / n;
    let edge = floor(p * 3);
    let localT = (p * 3) % 1;
    let a = vertices[edge];
    let b = vertices[(edge + 1) % 3];
    let x = lerp(a.x, b.x, localT);
    let y = lerp(a.y, b.y, localT);
    arr.push(createVector(x, y));
  }
  return arr;
}
