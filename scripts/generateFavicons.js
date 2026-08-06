import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/favicon.png'));

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));

  // 48x48 PNG (Google Search Favicon standard)
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.resolve('public/favicon-48x48.png'));

  // 48x48 ICO fallback
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.resolve('public/favicon.ico'));

  console.log('✅ Generated Google Search Favicons successfully!');
}

generate().catch(console.error);
