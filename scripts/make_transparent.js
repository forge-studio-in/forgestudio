const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const assetsToProcess = [
  '01_logo.png',
  '02_service_line.png',
  '03_something_powerful.png',
  '04_coming_soon.png',
  '05_forge_studio_hero.png',
  '06_divider_description.png',
];

const assetsDir = path.join(__dirname, '../public/assets');

assetsToProcess.forEach((filename) => {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) return;

  fs.createReadStream(filePath)
    .pipe(new PNG({ filterType: 4 }))
    .on('parsed', function () {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          const r = this.data[idx];
          const g = this.data[idx + 1];
          const b = this.data[idx + 2];

          // If pixel is near-white or light studio grey background (R,G,B > 220), make it transparent
          if (r > 215 && g > 218 && b > 215) {
            this.data[idx + 3] = 0; // Alpha = 0
          }
        }
      }

      this.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
        console.log(`Processed ${filename} to 100% HD transparent PNG`);
      });
    });
});
