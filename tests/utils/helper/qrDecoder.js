const fs = require('fs');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

class QrDecoder {
  decodeFromPng(png) {
    const imageData = new Uint8ClampedArray(png.data);
    return jsQR(imageData, png.width, png.height, { inversionAttempts: 'attemptBoth' });
  }

  clampRegion(png, region) {
    const x = Math.max(0, Math.floor(region.x));
    const y = Math.max(0, Math.floor(region.y));
    const maxWidth = png.width - x;
    const maxHeight = png.height - y;
    const width = Math.max(1, Math.min(Math.floor(region.width), maxWidth));
    const height = Math.max(1, Math.min(Math.floor(region.height), maxHeight));
    return { x, y, width, height };
  }

  crop(png, region) {
    const { x, y, width, height } = this.clampRegion(png, region);
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

  trimMargin(png, marginRatio) {
    const mx = Math.floor(png.width * marginRatio);
    const my = Math.floor(png.height * marginRatio);
    return this.crop(png, {
      x: mx,
      y: my,
      width: png.width - (mx * 2),
      height: png.height - (my * 2),
    });
  }

  threshold(png, thresholdValue) {
    const out = new PNG({ width: png.width, height: png.height });

    for (let i = 0; i < png.data.length; i += 4) {
      const r = png.data[i];
      const g = png.data[i + 1];
      const b = png.data[i + 2];
      const a = png.data[i + 3];
      const lum = Math.round((0.299 * r) + (0.587 * g) + (0.114 * b));
      const v = lum >= thresholdValue ? 255 : 0;

      out.data[i] = v;
      out.data[i + 1] = v;
      out.data[i + 2] = v;
      out.data[i + 3] = a;
    }

    return out;
  }

  upscale(png, factor) {
    const width = Math.max(1, Math.floor(png.width * factor));
    const height = Math.max(1, Math.floor(png.height * factor));
    const out = new PNG({ width, height });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcX = Math.min(png.width - 1, Math.floor(x / factor));
        const srcY = Math.min(png.height - 1, Math.floor(y / factor));

        const srcIdx = (srcY * png.width + srcX) * 4;
        const dstIdx = (y * width + x) * 4;

        out.data[dstIdx] = png.data[srcIdx];
        out.data[dstIdx + 1] = png.data[srcIdx + 1];
        out.data[dstIdx + 2] = png.data[srcIdx + 2];
        out.data[dstIdx + 3] = png.data[srcIdx + 3];
      }
    }

    return out;
  }

  decodeWithVariants(png) {
    const variants = [png, this.trimMargin(png, 0.02), this.trimMargin(png, 0.05)];

    if (Math.min(png.width, png.height) < 350) {
      variants.push(this.upscale(png, 2));
    }

    for (const variant of variants) {
      const direct = this.decodeFromPng(variant);
      if (direct) return direct.data;

      for (const t of [90, 110, 130, 150, 170, 190]) {
        const bw = this.threshold(variant, t);
        const decoded = this.decodeFromPng(bw);
        if (decoded) return decoded.data;
      }
    }

    return null;
  }

  buildRegions(png) {
    const w = png.width;
    const h = png.height;
    const minSide = Math.min(w, h);
    const centerSquare90 = {
      x: (w - (minSide * 0.9)) / 2,
      y: (h - (minSide * 0.9)) / 2,
      width: minSide * 0.9,
      height: minSide * 0.9,
    };
    const centerSquare70 = {
      x: (w - (minSide * 0.7)) / 2,
      y: (h - (minSide * 0.7)) / 2,
      width: minSide * 0.7,
      height: minSide * 0.7,
    };

    return [
      { x: 0, y: 0, width: w, height: h },
      { x: 0, y: 0, width: w, height: h * 0.85 },
      { x: 0, y: h * 0.1, width: w, height: h * 0.9 },
      centerSquare90,
      centerSquare70,
      { x: w * 0.5, y: 0, width: w * 0.5, height: h },
      { x: w * 0.6, y: h * 0.15, width: w * 0.4, height: h * 0.7 },
      { x: w * 0.65, y: 0, width: w * 0.35, height: h * 0.5 },
      { x: w * 0.65, y: h * 0.5, width: w * 0.35, height: h * 0.5 },
      { x: w * 0.6, y: h * 0.25, width: w * 0.4, height: h * 0.5 },
      { x: 0, y: 0, width: w * 0.5, height: h },
      { x: 0, y: h * 0.15, width: w * 0.4, height: h * 0.7 },
    ];
  }

  decodeQRCodeFromImage(imagePath) {
    const png = PNG.sync.read(fs.readFileSync(imagePath));

    for (const region of this.buildRegions(png)) {
      const candidate = this.crop(png, region);
      if (candidate.width < 40 || candidate.height < 40) continue;

      const decoded = this.decodeWithVariants(candidate);
      if (decoded) return decoded;
    }

    throw new Error('QR code not detected after multi-pass decode attempts');
  }
}

module.exports = QrDecoder;
