let childrenPerGroupSlider, childLayoutSelect, childDistanceSlider, angleOffsetSlider;
let groupCountSlider, layoutSelect, shapeSelect;

function setupUI() {
  let ui = createDiv().parent("canvas-holder");

  createP("Number of Groups").parent(ui);
  groupCountSlider = createSlider(1, 5, 1, 1);
  groupCountSlider.parent(ui);

  createP("Shape").parent(ui);
  shapeSelect = createSelect();
  shapeSelect.option("random");
  shapeSelect.option("circle");
  shapeSelect.option("square");
  shapeSelect.option("triangle");
  shapeSelect.parent(ui);

  createP("Layout").parent(ui);
  layoutSelect = createSelect();
  layoutSelect.option("radial");
  layoutSelect.option("orbit");
  layoutSelect.option("scatter");
  layoutSelect.parent(ui);

  let regenButton = createButton("Regenerate Composition");
  regenButton.parent(ui);
  regenButton.mousePressed(regenerate);

  let newStructureButton = createButton("New Structure");
  newStructureButton.parent(ui);
  newStructureButton.mousePressed(newStructure);

    createP("Number of Children per Group").parent(ui);
    childrenPerGroupSlider = createSlider(1, 10, 3, 1);
    childrenPerGroupSlider.parent(ui);

    createP("Children Layout").parent(ui);
    childLayoutSelect = createSelect();
    childLayoutSelect.option("radial");
    childLayoutSelect.option("orbit");
    childLayoutSelect.option("scatter");
    childLayoutSelect.parent(ui);

    createP("Children Distance from Parent").parent(ui);
    childDistanceSlider = createSlider(20, 200, 80, 5);
    childDistanceSlider.parent(ui);

    createP("Max Shape Tilt Angle").parent(ui);
    angleOffsetSlider = createSlider(0, 45, 10, 1);
    angleOffsetSlider.parent(ui);
}