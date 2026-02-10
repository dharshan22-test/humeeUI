// const fs = require('fs');
// const jsQR = require('jsqr');
// const { PNG } = require('pngjs');

// class QrDecoder {
//   decodeQRCodeFromImage(imagePath) {
//     const png = PNG.sync.read(fs.readFileSync(imagePath));
//     console.log(imagePath);
//     const imageData = new Uint8ClampedArray(png.data);

//     const code = jsQR(imageData, png.width, png.height);

//     if (!code) {
//       throw new Error('QR code not detected in image');
//     }

//     return code.data;
//   }
// }

// module.exports = QrDecoder;

const fs = require('fs');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

class QrDecoder {

  decodeFromPng(png) {
    const imageData = new Uint8ClampedArray(png.data);
    return jsQR(imageData, png.width, png.height);
  }

  crop(png, { x, y, width, height }) {
    const cropped = new PNG({ width, height });

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const srcIdx = ((y + row) * png.width + (x + col)) * 4;
        const dstIdx = (row * width + col) * 4;
        png.data.copy(cropped.data, dstIdx, srcIdx, srcIdx + 4);
      }
    }
    return cropped;
  }

  decodeQRCodeFromImage(imagePath) {
    const png = PNG.sync.read(fs.readFileSync(imagePath));

    // 1️⃣ Try full image
    let code = this.decodeFromPng(png);
    if (code) return code.data;

    // 2️⃣ Fallback regions (relative positions)
    const regions = [
      // top-right
      { x: png.width * 0.65, y: 0, width: png.width * 0.35, height: png.height * 0.5 },
      // bottom-right
      { x: png.width * 0.65, y: png.height * 0.5, width: png.width * 0.35, height: png.height * 0.5 },
      // center-right
      { x: png.width * 0.6, y: png.height * 0.25, width: png.width * 0.4, height: png.height * 0.5 },
    ];

    for (const region of regions) {
      const cropped = this.crop(png, {
        x: Math.floor(region.x),
        y: Math.floor(region.y),
        width: Math.floor(region.width),
        height: Math.floor(region.height),
      });

      code = this.decodeFromPng(cropped);
      if (code) return code.data;
    }

    throw new Error('QR code not detected (even after fallback crops)');
  }
}

module.exports = QrDecoder;
