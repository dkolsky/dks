// layers.js

function drawBaseLayer() {
    baseLayer.clear();
    baseLayer.noStroke();
    baseLayer.fill(0);
  
    for (let c of circles) {
      if (!boostedCircles.includes(c)) {
        baseLayer.ellipse(c.x, c.y, c.size);
      }
    }
  }
  
  function drawBoostLayer() {
    boostLayer.clear();
    boostLayer.noStroke();
    boostLayer.fill(0);
  
    for (let c of boostedCircles) {
      boostLayer.ellipse(c.x, c.y, c.size);
    }
  }
  
  function regenerateCircles() {
    // Fill circles and boostedCircles based on your idea
    circles = [];
    boostedCircles = [];
    
    // Example: random points
    for (let i = 0; i < 500; i++) {
      let c = { x: random(width), y: random(height), size: random(5, 15) };
      circles.push(c);
    }
  
    // Example: randomly boost some
    for (let i = 0; i < 50; i++) {
      let index = floor(random(circles.length));
      circles[index].size *= random(1.5, 3.0);
      boostedCircles.push(circles[index]);
    }
  
    redraw();
  }