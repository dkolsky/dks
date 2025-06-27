let settings = {
  numPetals: 20,
  growth: 6,
  roughness: 0.4,
  petalSize: 1.5,
  angle: 137.5,
  corners: 5,
};

let gui;

function setup() {
  createCanvas(600, 600, 'svg');
  angleMode(RADIANS);
  noFill();
  stroke(0);

  gui = new dat.GUI();
  gui.add(settings, 'numPetals', 1, 200, 1).onChange(redraw);
  gui.add(settings, 'growth', 1, 20, 0.1).onChange(redraw);
  gui.add(settings, 'roughness', 0, 2, 0.01).onChange(redraw);
  gui.add(settings, 'petalSize', 0.1, 5, 0.1).onChange(redraw);
  gui.add(settings, 'angle', 0, 360, 0.1).onChange(redraw);
  gui.add(settings, 'corners', 3, 12, 1).onChange(redraw);

  noLoop();

  let saveBtn = createButton('Save SVG');
  saveBtn.position(10, height + 10);
  saveBtn.mousePressed(() => save("bloom.svg"));
}

function draw() {
  clear();
  randomSeed(42);

  translate(width / 2, height / 2);
  let goldenAngle = radians(settings.angle);

  for (let i = 0; i < settings.numPetals; i++) {
    let angle = i * goldenAngle;
    let r = i * settings.growth;
    let x = cos(angle) * r;
    let y = sin(angle) * r;

    let baseRadius = 8 + i * settings.petalSize;

    push();
    translate(x, y);
    rotate(angle);

    beginShape();
    for (let j = 0; j < settings.corners; j++) {
      let theta = j * TWO_PI / settings.corners;
      let radiusOffset = random(-1, 1) * baseRadius * settings.roughness * 0.25;
      let rad = baseRadius + radiusOffset;
      let px = cos(theta) * rad;
      let py = sin(theta) * rad;
      vertex(px, py);
    }
    endShape(CLOSE);

    pop();
  }
}