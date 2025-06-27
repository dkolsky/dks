// UI Elements
let dotSizeSlider, dotSpacingSlider;
let minBoostSlider, maxBoostSlider;
let invertButton, exportBoostedButton, exportBaseButton;
let regenerateBaseButton, regenerateBoostedButton;

function setupUI() {
  // === Base Controls (left card) ===
  const baseControls = select('#base-controls');

  let dotSizeLabel = createDiv('Max Dot Size:');
  dotSizeLabel.parent(baseControls);

  dotSizeSlider = createSlider(1, 20, 8, 0.1);
  dotSizeSlider.parent(baseControls);

  let dotSpacingLabel = createDiv('Dot Spacing:');
  dotSpacingLabel.parent(baseControls);

  dotSpacingSlider = createSlider(2, 30, 9, 1);
  dotSpacingSlider.parent(baseControls);

  regenerateBaseButton = createButton('Regenerate Base Dots');
  regenerateBaseButton.mousePressed(() => {
    regenerateCircles();
  });
  regenerateBaseButton.parent(baseControls);

  // === Boost Controls (center card) ===
  const boostControls = select('#boost-controls');

  let minBoostLabel = createDiv('Min Boost:');
  minBoostLabel.parent(boostControls);

  minBoostSlider = createSlider(1, 3, 1.5, 0.1);
  minBoostSlider.parent(boostControls);

  let maxBoostLabel = createDiv('Max Boost:');
  maxBoostLabel.parent(boostControls);

  maxBoostSlider = createSlider(3, 6, 4, 0.1);
  maxBoostSlider.parent(boostControls);

  let numBoostedLabel = createDiv('Number of Boosted Dots:');
  numBoostedLabel.parent(boostControls);

  numBoostedSlider = createSlider(10, 500, 100, 1); // adjust min/max as you like
  numBoostedSlider.parent(boostControls);

  regenerateBoostedButton = createButton('Regenerate Boosted Dots');
  regenerateBoostedButton.mousePressed(() => {
    regenerateBoostedCircles();
  });
  regenerateBoostedButton.parent(boostControls);

  // === File Controls (right card) ===
  const fileControls = select('#file-controls');

  invertButton = createButton('Invert Colors');
invertButton.mousePressed(() => {
  toggleInvert();
});
invertButton.parent(fileControls);

  exportBoostedButton = createButton('Export Boosted Layer (SVG)');
  exportBoostedButton.mousePressed(() => {
    exportBoostedSVG();
  });
  exportBoostedButton.parent(fileControls);

  exportBaseButton = createButton('Export Base Layer (SVG)');
  exportBaseButton.mousePressed(() => {
    exportBaseSVG();
  });
  exportBaseButton.parent(fileControls);
}