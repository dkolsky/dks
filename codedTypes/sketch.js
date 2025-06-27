let gradientAnchor = "background"; // or "palette"
let shapeMap = {};
let shapes = [1, 2, 3];
let wordInput, submitButton;
let shapeSize = 120;
let margin = 120;
let canvasSize = 800;
let colors = [
  { name: "Neutrals/1", rgb: [232, 232, 232] },
  { name: "Neutrals/2", rgb: [196, 196, 196] },
  { name: "Neutrals/3", rgb: [24, 24, 24] },
  { name: "Yellow/1", rgb: [255, 254, 231] },
  { name: "Yellow/2", rgb: [255, 251, 177] },
  { name: "Yellow/3", rgb: [252, 245, 109] },
  { name: "Yellow/4", rgb: [228, 185, 0] },
  { name: "Orange/1", rgb: [255, 240, 217] },
  { name: "Orange/2", rgb: [255, 223, 176] },
  { name: "Orange/3", rgb: [255, 207, 139] },
  { name: "Orange/4", rgb: [254, 127, 32] },
  { name: "Green/1", rgb: [235, 250, 245] },
  { name: "Green/2", rgb: [200, 247, 229] },
  { name: "Green/3", rgb: [126, 250, 151] },
  { name: "Green/4", rgb: [3, 199, 120] }
];
let inputWord = "deformation";

let shapeGradientSelect, backgroundGradientSelect1, backgroundGradientSelect2, exportButton;
let gradientStepsSlider;
let gradientDirectionSelect;
let outlineToggle;
let fillToggle;
let outlineColorSelect;

function setup() {
    createCanvas(canvasSize, canvasSize);
    background(246);
    angleMode(DEGREES);
    noStroke();

    let uiParent = select('#controlPanel'); // Mount UI into this container

    wordInput = createInput(inputWord);
    wordInput.parent(uiParent);

    submitButton = createButton('Update');
    submitButton.parent(uiParent);
    submitButton.mousePressed(triggerRedraw);

    shapeGradientSelect = createSelect();
    shapeGradientSelect.parent(uiParent);
    shapeGradientSelect.option('shape', 'background');
    colors.forEach((c, i) => {
      shapeGradientSelect.option(c.name, `palette-${i}`);
    });
    shapeGradientSelect.changed(triggerRedraw);

    backgroundGradientSelect1 = createSelect();
    backgroundGradientSelect1.parent(uiParent);
    backgroundGradientSelect1.option('Start Color', 'background');
    colors.forEach((c, i) => {
      backgroundGradientSelect1.option(c.name, `palette-${i}`);
    });
    let bgInitIndex = floor(random(colors.length));
    backgroundGradientSelect1.selected(`palette-${bgInitIndex}`);
    backgroundGradientSelect1.changed(triggerRedraw);

    backgroundGradientSelect2 = createSelect();
    backgroundGradientSelect2.parent(uiParent);
    backgroundGradientSelect2.option('End Color', 'background');
    colors.forEach((c, i) => {
      backgroundGradientSelect2.option(c.name, `palette-${i}`);
    });
    let bgInitIndex2 = floor(random(colors.length));
    backgroundGradientSelect2.selected(`palette-${bgInitIndex2}`);
    backgroundGradientSelect2.changed(triggerRedraw);

    gradientDirectionSelect = createSelect();
    gradientDirectionSelect.parent(uiParent);
    gradientDirectionSelect.option('palette-to-bg');
    gradientDirectionSelect.option('bg-to-palette');
    gradientDirectionSelect.changed(triggerRedraw);

    gradientStepsSlider = createInput('100', 'number');
    gradientStepsSlider.attribute('min', '10');
    gradientStepsSlider.attribute('max', '500');
    gradientStepsSlider.attribute('step', '10');
    gradientStepsSlider.parent(uiParent);
    gradientStepsSlider.input(triggerRedraw);

    outlineToggle = createCheckbox('Outline', false);
    outlineToggle.parent(uiParent);
    outlineToggle.changed(triggerRedraw);

    fillToggle = createCheckbox('Fill', true);
    fillToggle.parent(uiParent);
    fillToggle.changed(triggerRedraw);

    outlineColorSelect = createSelect();
    outlineColorSelect.parent(uiParent);
    outlineColorSelect.option('match shape color', 'match');
    colors.forEach((c, i) => {
      outlineColorSelect.option(c.name, `palette-${i}`);
    });
    outlineColorSelect.changed(triggerRedraw);

    exportButton = createButton('Export');
    exportButton.parent(uiParent);
    exportButton.mousePressed(exportCanvas);

    noLoop();
    buildShapeMap();
    drawWord(inputWord);
}

function buildShapeMap() {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < alphabet.length; i++) {
        shapeMap[alphabet[i]] = shapes[i % shapes.length];
    }
}

function drawWord(wordRaw) {
    clear(); // clears previous frame

    let word = wordInput.value().toLowerCase();

    noStroke();
    let bgSetting1 = backgroundGradientSelect1.value();
    let bgSetting2 = backgroundGradientSelect2.value();

    let col1 = bgSetting1 === 'background' ? [246, 246, 246] : colors[int(bgSetting1.split("-")[1])].rgb;
    let col2 = bgSetting2 === 'background' ? [246, 246, 246] : colors[int(bgSetting2.split("-")[1])].rgb;

    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let r = lerp(col1[0], col2[0], inter);
        let g = lerp(col1[1], col2[1], inter);
        let b = lerp(col1[2], col2[2], inter);
        fill(r, g, b);
        rect(0, y, width, 1);
    }

    let cols = 4;
    let rows = 3;
    let cellW = (canvasSize - 2 * margin) / cols;
    let cellH = (canvasSize - 2 * margin) / rows;
    let startX = margin;
    let startY = (canvasSize - (cellH * rows)) / 2;

    let blurShapes = [];
    let sharpShapes = [];

    let shuffledColors = shuffle(colors);
    for (let i = 0; i < min(word.length, 12); i++) {
        let col = i % cols;
        let row = floor(i / cols);
        let x = startX + col * cellW + cellW / 2;
        let y = startY + row * cellH + cellH / 2;

        let isRepeated = i > 0 && shapeMap[word[i]] === shapeMap[word[i - 1]];
        let direction = random(["tl", "tr", "bl", "br"]);
        let displacementX = 0;
        let displacementY = 0;
        let shapeType = shapeMap[word[i]];
        let scaleFactor = random(0.75, 2);
        let size = shapeSize * scaleFactor;
        let colRGB = shuffledColors[i % shuffledColors.length].rgb;
        let rotation = random(5, 65);
        if (isRepeated) {
            blurShapes.push({ x: x + displacementX, y: y + displacementY, shapeType, size, colRGB, direction, rotation });
        } else {
            let zIndex = random(0, 1); // simple floating effect for now
            sharpShapes.push({ x: x + displacementX, y: y + displacementY, shapeType, size, colRGB, direction, rotation, zIndex });
        }
    }

    // Sort and draw sharp shapes
    sharpShapes.sort((a, b) => a.zIndex - b.zIndex);
    for (let s of sharpShapes) {
        push();
        translate(s.x, s.y);
        rotate(s.rotation);
        drawMaskedGradientShape(s.shapeType, s.colRGB, s.direction, s.size);
        pop();
    }

    drawingContext.filter = 'blur(12px)';
    for (let s of blurShapes) {
        push();
        translate(s.x, s.y);
        rotate(s.rotation);
        drawMaskedGradientShape(s.shapeType, s.colRGB, s.direction, s.size);
        pop();
    }
    drawingContext.filter = 'none';

    // Removed canvas outline as per instructions
    // fill(246, 246, 246, 30);
    // rect(0, 0, width, height);
}

function drawMaskedGradientShape(type, colRGB, direction, size) {
  let steps = int(gradientStepsSlider.value());

  if (steps <= 1) {
    if (outlineToggle.checked()) {
      let strokeRGB = colRGB;
      let selectedOutline = outlineColorSelect.value();
      if (selectedOutline !== 'match') {
        let index = int(selectedOutline.split("-")[1]);
        strokeRGB = colors[index].rgb;
      }
      stroke(...strokeRGB, 204);
      strokeWeight(1);
    } else {
      noStroke();
    }

    if (fillToggle.checked()) {
      fill(...colRGB, 204);
    } else {
      noFill();
    }

    if (type === 1) {
      ellipse(0, 0, size, size);
    } else if (type === 2) {
      rectMode(CENTER);
      rect(0, 0, size, size);
    } else if (type === 3) {
      let h = size * sqrt(3) / 2;
      triangle(
        0, -2 / 3 * h,
        -size / 2, h / 3,
        size / 2, h / 3
      );
    }
    return;
  }

  // Multi-step rendering
  let shapeAnchor = shapeGradientSelect.value();
  let index = shapeAnchor === "background" ? -1 : int(shapeAnchor.split("-")[1]);
  let anchorColor = index === -1 ? [246, 246, 246] : colors[index].rgb;

  let colorStart, colorEnd;
  if (gradientDirectionSelect.value() === 'palette-to-bg') {
    colorStart = colRGB;
    colorEnd = anchorColor;
  } else {
    colorStart = anchorColor;
    colorEnd = colRGB;
  }

  for (let i = 0; i < steps; i++) {
    let inter = i / steps;
    let r = lerp(colorStart[0], colorEnd[0], inter);
    let g = lerp(colorStart[1], colorEnd[1], inter);
    let b = lerp(colorStart[2], colorEnd[2], inter);
    if (outlineToggle.checked()) {
      let strokeRGB = [r, g, b];
      let selectedOutline = outlineColorSelect.value();
      if (selectedOutline !== 'match') {
        let index = int(selectedOutline.split("-")[1]);
        strokeRGB = colors[index].rgb;
      }
      stroke(...strokeRGB, 204);
      strokeWeight(1);
    } else {
      noStroke();
    }

    if (fillToggle.checked()) {
      fill(r, g, b, 204);
    } else {
      noFill();
    }

    let offsetX = 0;
    let offsetY = 0;
    let gradOffset = size * inter;

    if (direction === "tl") {
      offsetX = -gradOffset;
      offsetY = -gradOffset;
    } else if (direction === "tr") {
      offsetX = gradOffset;
      offsetY = -gradOffset;
    } else if (direction === "bl") {
      offsetX = -gradOffset;
      offsetY = gradOffset;
    } else if (direction === "br") {
      offsetX = gradOffset;
      offsetY = gradOffset;
    }

    let drawSize = size * (1 - inter);
    if (type === 1) {
      ellipse(offsetX, offsetY, drawSize, drawSize);
    } else if (type === 2) {
      rectMode(CENTER);
      rect(offsetX, offsetY, drawSize, drawSize);
    } else if (type === 3) {
      let h = drawSize * sqrt(3) / 2;
      triangle(
        offsetX, offsetY - 2 / 3 * h,
        offsetX - drawSize / 2, offsetY + h / 3,
        offsetX + drawSize / 2, offsetY + h / 3
      );
    }
  }
}

function triggerRedraw() {
    drawWord(wordInput.value());
}

function exportCanvas() {
    let c = get();
    let scaleFactor = 3;
    let gfx = createGraphics(width * scaleFactor, height * scaleFactor);
    gfx.image(c, 0, 0, gfx.width, gfx.height);
    save(gfx, 'codedType.gif');
}
