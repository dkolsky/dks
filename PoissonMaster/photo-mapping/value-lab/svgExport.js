// svgExport.js

function saveBaseLayerAsSVG() {
    let svgHeader = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="white"/>
    `;
  
    let svgCircles = circles
      .filter(c => !boostedCircles.includes(c))
      .map(c => `<circle cx="${c.x}" cy="${c.y}" r="${c.size / 2}" fill="black" />`)
      .join('\n');
  
    let svgFooter = `</svg>`;
    downloadSVG(svgHeader + svgCircles + svgFooter, 'baseLayer');
  }
  
  function saveBoostedLayerAsSVG() {
    let svgHeader = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="white"/>
    `;
  
    let svgCircles = boostedCircles
      .map(c => `<circle cx="${c.x}" cy="${c.y}" r="${c.size / 2}" fill="black" />`)
      .join('\n');
  
    let svgFooter = `</svg>`;
    downloadSVG(svgHeader + svgCircles + svgFooter, 'boostedLayer');
  }
  
  function downloadSVG(content, filename) {
    let blob = new Blob([content], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().replace(/[-:T]/g, '').replace(/\..+/, '')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }