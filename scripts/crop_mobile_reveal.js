const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '..', 'public', 'assets', 'reference-bg.png');
const outputPath = path.join(__dirname, '..', 'public', 'assets', 'mobile-cloth-reveal.png');

if (!fs.existsSync(inputPath)) {
  console.error('Source background not found:', inputPath);
  process.exit(1);
}

const data = fs.readFileSync(inputPath);
const srcPng = PNG.sync.read(data);

// Crop ONLY the 3D arch portal, emerald cloth drape, pedestal, floor reflection, and side circuit graphics
// cropX: 820, cropY: 90, cropW: 1000, cropH: 650 (Excludes top service line and bottom footer bar completely)

const cropX = 820;
const cropY = 90;
const cropW = 1000;
const cropH = 650;

const dstPng = new PNG({ width: cropW, height: cropH });

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcX = cropX + x;
    const srcY = cropY + y;
    const srcIdx = (srcPng.width * srcY + srcX) << 2;
    const dstIdx = (cropW * y + x) << 2;

    dstPng.data[dstIdx] = srcPng.data[srcIdx];
    dstPng.data[dstIdx + 1] = srcPng.data[srcIdx + 1];
    dstPng.data[dstIdx + 2] = srcPng.data[srcIdx + 2];
    dstPng.data[dstIdx + 3] = srcPng.data[srcIdx + 3];
  }
}

const buffer = PNG.sync.write(dstPng);
fs.writeFileSync(outputPath, buffer);
console.log(`Cleanly cropped 3D reveal visual image (${cropW}x${cropH}) to ${outputPath}`);
