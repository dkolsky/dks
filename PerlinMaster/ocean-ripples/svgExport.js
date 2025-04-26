function saveBaseLayerAsSVG() {
    exportLayer(circles.filter(c => c.layer === "base"), "baseLayer");
  }
  
  function saveMidLayerAsSVG() {
    exportLayer(circles.filter(c => c.layer === "mid"), "midLayer");
  }
  
  function saveBoostedLayerAsSVG() {
    exportLayer(boostedCircles, "boostedLayer");
  }
  
  function exportLayer(circleArray, name) {
    let svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n<rect width="100%" height="100%" fill="white"/>`;
    let svgCircles = circleArray.map(c => `<circle cx="${c.x}" cy="${c.y}" r="${c.size/2}" fill="black" />`).join("\n");
    let svgFooter = "\n</svg>";
    let fullSVG = svgHeader + svgCircles + svgFooter;
  
    let blob = new Blob([fullSVG], { type: "image/svg+xml" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = name + ".svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }