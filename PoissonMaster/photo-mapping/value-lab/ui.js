// ui.js
let numBoostedSlider;

function setupUI() {
    let uiContainer = createDiv().parent('canvas-holder');
    uiContainer.style('display', 'flex');
    uiContainer.style('flexWrap', 'wrap');
    uiContainer.style('gap', '20px');
  
    // baseControls
    let baseControls = createDiv().parent(uiContainer);
    baseControls.style('display', 'flex');
    baseControls.style('flexDirection', 'column');
    baseControls.style('gap', '5px');
  
    let regenButton = createButton('Regenerate Circles');
    regenButton.parent(baseControls);
    regenButton.mousePressed(regenerateCircles);
  
    let saveBaseButton = createButton('Save Base as SVG');
    saveBaseButton.parent(baseControls);
    saveBaseButton.mousePressed(saveBaseLayerAsSVG);
  
    let saveBoostButton = createButton('Save Boosted as SVG');
    saveBoostButton.parent(baseControls);
    saveBoostButton.mousePressed(saveBoostedLayerAsSVG);
  
    // boostControls
    let boostControls = createDiv().parent(uiContainer);
    boostControls.style('display', 'flex');
    boostControls.style('flexDirection', 'column');
    boostControls.style('gap', '5px');

    createP('Number of Boosted Dots').parent(boostControls);
    numBoostedSlider = createSlider(0, 500, 0, 1); // min: 0, max: 500, default: 0
    numBoostedSlider.parent(boostControls);
  
    createP('Boost Scale Min').parent(boostControls);
    boostMinSlider = createSlider(0.1, 3.0, 0.5, 0.1);
    boostMinSlider.parent(boostControls);
  
    createP('Boost Scale Max').parent(boostControls);
    boostMaxSlider = createSlider(1.0, 6.0, 3.5, 0.1);
    boostMaxSlider.parent(boostControls);
  
    let refreshBoostButton = createButton('Refresh Boosted Dots');
    refreshBoostButton.parent(boostControls);
    refreshBoostButton.mousePressed(regenerateBoostedCircles);
  }