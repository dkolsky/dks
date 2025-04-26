function drawBaseLayer() {
    baseLayer.clear();
    baseLayer.noStroke();
    baseLayer.fill(0);
  
    for (let c of circles) {
      if (c.layer === "base") {
        baseLayer.ellipse(c.x, c.y, c.size);
      }
    }
  }
  
  function drawMidLayer() {
    midLayer.clear();
    midLayer.noStroke();
    midLayer.fill(0);
  
    for (let c of circles) {
      if (c.layer === "mid") {
        midLayer.ellipse(c.x, c.y, c.size);
      }
    }
  }
  
  function drawBoostedLayer() {
    boostedLayer.clear();
    boostedLayer.noStroke();
    boostedLayer.fill(0);
  
    for (let c of boostedCircles) {
      boostedLayer.ellipse(c.x, c.y, c.size);
    }
  }
  
  function regenerateCircles() {
    contrastAmount = contrastSlider.value(); // get live slider value
    circles = [];
    boostedCircles = [];
  
    contrastAmount = 1; // 🛠️ Boost this higher for more contrast (1.0 = normal)
  
    for (let i = 0; i < 10000; i++) { // 4000 samples randomly across canvas
      let x = random(width);
      let y = random(height);
      let n = noise(x * noiseScale, y * noiseScale);
  
      // 🎨 Boost contrast by applying power
      n = pow(n, contrastAmount);
  
      if (n > 0.95) {
        continue; // skip super bright areas = pure white
      }
  
      let size = map(n, 0, 1, 0.5, 8);
  
      if (size < 2) {
        continue; // skip tiny meaningless dots
      }
  
      let layer = "base";
      if (n > 0.55) layer = "mid";
  
      circles.push({ x, y, size, layer });
    }
  
    let numBoosted = numBoostedSlider.value();
    for (let i = 0; i < numBoosted; i++) {
      let index = floor(random(circles.length));
      let c = circles[index];
      let minBoost = boostMinSlider.value();
      let maxBoost = boostMaxSlider.value();
      c.size *= random(minBoost, maxBoost);
      boostedCircles.push(c);
    }
  
    redraw();
  }
  
   