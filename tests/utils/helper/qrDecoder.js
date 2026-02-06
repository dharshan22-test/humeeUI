const fs = require('fs');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

class QrDecoder {
  decodeQRCodeFromImage(imagePath) {
    const png = PNG.sync.read(fs.readFileSync(imagePath));
    const imageData = new Uint8ClampedArray(png.data);

    const code = jsQR(imageData, png.width, png.height);

    if (!code) {
      throw new Error('QR code not detected in image');
    }

    return code.data;
  }
}

module.exports = QrDecoder;
