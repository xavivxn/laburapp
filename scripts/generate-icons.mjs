import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const iconsDir = resolve(root, "public/icons");
const publicDir = resolve(root, "public");

const targets = [
  { src: "icon.svg", out: resolve(iconsDir, "icon-192.png"), size: 192 },
  { src: "icon.svg", out: resolve(iconsDir, "icon-512.png"), size: 512 },
  { src: "icon.svg", out: resolve(publicDir, "apple-touch-icon.png"), size: 180 },
  { src: "icon-maskable.svg", out: resolve(iconsDir, "icon-maskable-512.png"), size: 512 },
];

for (const { src, out, size } of targets) {
  const svg = readFileSync(resolve(iconsDir, src));
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`generated ${out.replace(root, "")} (${size}x${size})`);
}
