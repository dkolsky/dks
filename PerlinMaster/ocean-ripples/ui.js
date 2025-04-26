function setupUI() {
    let uiContainer = createDiv().parent('canvas-holder');
    uiContainer.style('display', 'flex');
    uiContainer.style('flexWrap', 'wrap');
    uiContainer.style('gap', '20px');
  
    let baseControls = createDiv().parent(uiContainer);
    baseControls.style('display', 'flex');
    baseControls.style('flexDirection', 'column');
    baseControls.style('gap', '5px');

    createP('Contrast Amount').parent(baseControls);
    contrastSlider = createSlider(0.5, 3.0, 1.0, 0.1);
    contrastSlider.parent(baseControls);
  
    createP('Noise Scale').parent(baseControls);
    noiseScaleSlider = createSlider(0.001, 0.02, 0.005, 0.001);
    noiseScaleSlider.parent(baseControls);
  
    createP('Boost Scale Min').parent(baseControls);
    boostMinSlider = createSlider(1.0, 2.0, 1.2, 0.1);
    boostMinSlider.parent(baseControls);
  
    createP('Boost Scale Max').parent(baseControls);
    boostMaxSlider = createSlider(1.5, 4.0, 2.5, 0.1);
    boostMaxSlider.parent(baseControls);
  
    createP('Number of Boosted Dots').parent(baseControls);
    numBoostedSlider = createSlider(0, 500, 0, 1);
    numBoostedSlider.parent(baseControls);
  
    let regenButton = createButton('Regenerate Ripples');
    regenButton.parent(baseControls);
    regenButton.mousePressed(() => {
      noiseScale = noiseScaleSlider.value();
      regenerateCircles();
    });
  
    let saveBaseButton = createButton('Save Base as SVG');
    saveBaseButton.parent(baseControls);
    saveBaseButton.mousePressed(saveBaseLayerAsSVG);
  
    let saveMidButton = createButton('Save Mid as SVG');
    saveMidButton.parent(baseControls);
    saveMidButton.mousePressed(saveMidLayerAsSVG);
  
    let saveBoostedButton = createButton('Save Boosted as SVG');
    saveBoostedButton.parent(baseControls);
    saveBoostedButton.mousePressed(saveBoostedLayerAsSVG);
  }