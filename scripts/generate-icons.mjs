
import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Foliant favicon mark - "F" in gold on ink
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0A0E27"/>
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="central"
    font-family="Georgia, serif" font-size="360" font-weight="400" font-style="italic"
    fill="#C8A961">F</text>
</svg>`;

const appDir = join(process.cwd(), "src", "app");
if (!existsSync(appDir)) mkdirSync(appDir, { recursive: true });

const publicDir = join(process.cwd(), "public");
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

(async () => {
  const buffer = Buffer.from(svg);
  writeFileSync(join(appDir, "icon.svg"), svg);
  await sharp(buffer).resize(180, 180).png().toFile(join(appDir, "apple-icon.png"));
  await sharp(buffer).resize(192, 192).png().toFile(join(publicDir, "icon-192.png"));
  await sharp(buffer).resize(512, 512).png().toFile(join(publicDir, "icon-512.png"));
  await sharp(buffer).resize(32, 32).png().toFile(join(appDir, "favicon.ico"));
  console.log("Icons generated.");
})();
