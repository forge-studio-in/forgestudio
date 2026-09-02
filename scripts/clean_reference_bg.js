const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const bgPath = path.join(__dirname, '..', 'public', 'assets', 'reference-bg.png');

if (!fs.existsSync(bgPath)) {
  console.error('BG not found:', bgPath);
  process.exit(1);
}

const data = fs.readFileSync(bgPath);
const png = PNG.sync.read(data);

console.log(`Cleaning image size: ${png.width} x ${png.height}`);

// The region where old baked-in countdown box and notify form outlines exist
// x: 60 to 770
// y: 500 to 745

// For each column x in [60..770], we sample the clean studio floor background pixel at y = 485
// and paint it down across y = [500..745] to completely erase all baked-in container outlines, shadow lines, and old text!

for (let x = 60; x <= 770; x++) {
  // Sample clean studio floor pixel right above the countdown box at y = 485
  const sampleY = 485;
  const sampleIdx = (png.width * sampleY + x) << 2;
  const r = png.data[sampleIdx];
  const g = png.data[sampleIdx + 1];
  const b = png.data[sampleIdx + 2];
  const a = png.data[sampleIdx + 3];

  for (let y = 500; y <= 745; y++) {
    const idx = (png.width * y + x) << 2;
    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = a;
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync(bgPath, buffer);
console.log('Successfully erased all duplicate baked-in box outlines and text from reference-bg.png!');
