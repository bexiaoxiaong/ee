const QRCodeModel = require('./qrcode-core.js');

function drawQRCode(text, canvasId, context, width = 200, height = 200) {
  const qr = new QRCodeModel(4, 'L');
  qr.addData(text);
  qr.make();

  const tileW = width / qr.getModuleCount();
  const tileH = height / qr.getModuleCount();

  for (let row = 0; row < qr.getModuleCount(); row++) {
    for (let col = 0; col < qr.getModuleCount(); col++) {
      context.setFillStyle(qr.isDark(row, col) ? '#000000' : '#FFFFFF');
      const w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
      const h = Math.ceil((row + 1) * tileH) - Math.floor(row * tileH);
      context.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
    }
  }

  context.draw();
}

module.exports = {
  drawQRCode
};
