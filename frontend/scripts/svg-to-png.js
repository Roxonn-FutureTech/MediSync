import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SVG_SOURCE = path.join(__dirname, '..', 'src', 'assets', 'logo.svg');
const PNG_OUTPUT = path.join(__dirname, '..', 'src', 'assets', 'logo.png');
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Ensure the icons directory exists
await fs.mkdir(ICONS_DIR, { recursive: true });

// First convert SVG to PNG
try {
  await sharp(SVG_SOURCE)
    .png()
    .resize(512, 512)
    .toFile(PNG_OUTPUT);
  
  console.log('Converted SVG to PNG');
  
  // Generate icons for each size
  await Promise.all(ICON_SIZES.map(async (size) => {
    try {
      await sharp(PNG_OUTPUT)
        .resize(size, size)
        .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} icon`);
    } catch (err) {
      console.error(`Error generating ${size}x${size} icon:`, err);
    }
  }));
} catch (err) {
  console.error('Error converting SVG to PNG:', err);
} 