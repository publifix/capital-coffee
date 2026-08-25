#!/usr/bin/env node
// Generates responsive WebP + JPG-fallback variants for the photos used on
// the site, plus favicon/apple-touch-icon/manifest icons from the logo.
// Runs before dev/build so `public/img` always has fresh derivatives.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src/assets/img");
const outDir = path.join(root, "public/img");
const iconOutDir = path.join(root, "public/icons");

const WIDTHS = [480, 768, 1024, 1600, 1920];
const FALLBACK_WIDTH = 1600;

const PHOTOS = [
  "hero",
  "about",
  "paquete-capital",
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
  "gallery-6",
  "gallery-7",
  "gallery-8",
  "gallery-9",
  "gallery-10",
  "gallery-11",
  "gallery-12",
];

async function buildPhoto(name) {
  const input = path.join(srcDir, `${name}.jpg`);
  const meta = await sharp(input).metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0 || widths[widths.length - 1] !== meta.width) {
    widths.push(Math.min(meta.width, WIDTHS[WIDTHS.length - 1]));
  }

  await Promise.all(
    widths.map((w) =>
      sharp(input)
        .resize({ width: w })
        .webp({ quality: 72 })
        .toFile(path.join(outDir, `${name}-${w}.webp`))
    )
  );

  const fallbackWidth = Math.min(FALLBACK_WIDTH, meta.width);
  await sharp(input)
    .resize({ width: fallbackWidth })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(outDir, `${name}-fallback.jpg`));

  return { name, widths, aspect: meta.width / meta.height };
}

async function buildIcons() {
  const logo = path.join(srcDir, "logo.png");
  const sizes = [
    { file: "favicon-32.png", size: 32 },
    { file: "favicon-192.png", size: 192 },
    { file: "favicon-512.png", size: 512 },
    { file: "apple-touch-icon.png", size: 180 },
  ];

  await Promise.all(
    sizes.map(({ file, size }) =>
      sharp(logo)
        .resize(size, size, {
          fit: "contain",
          background: { r: 18, g: 18, b: 18, alpha: 1 },
        })
        .png()
        .toFile(path.join(iconOutDir, file))
    )
  );

  // Header/footer/preloader logo — transparent PNG, right-sized for on-screen use.
  await sharp(logo)
    .resize(480, 480, { fit: "inside" })
    .png()
    .toFile(path.join(outDir, "logo.png"));

  // og:image — logo centered on brand-black canvas at social share ratio.
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(logo).resize(480, 480, { fit: "inside" }).toBuffer(),
        gravity: "center",
      },
    ])
    .jpeg({ quality: 85 })
    .toFile(path.join(root, "public/og-image.jpg"));
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(iconOutDir, { recursive: true });

  const results = await Promise.all(PHOTOS.map(buildPhoto));
  await buildIcons();

  console.log(`optimize-images: generated ${results.length} photo sets + icons`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
