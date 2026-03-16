/**
 * convert-frames.mjs
 * Konversi semua frame PNG animasi hero ke WebP
 * Jalankan: node convert-frames.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const INPUT_DIR  = join(__dirname, 'src/assets/images/foto animasi');
const OUTPUT_DIR = join(__dirname, 'src/assets/images/foto animasi webp');
const WEBP_QUALITY = 82; // 80-85 sweet spot: ukuran kecil, kualitas bagus

async function main() {
  // Buat output folder kalau belum ada
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Ambil semua file PNG, sorted by name
  const files = (await readdir(INPUT_DIR))
    .filter(f => f.toLowerCase().endsWith('.png'))
    .sort();

  console.log(`🔄 Converting ${files.length} PNG frames to WebP (quality: ${WEBP_QUALITY})...`);
  console.log(`📂 Input:  ${INPUT_DIR}`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  console.log('');

  let totalInputSize  = 0;
  let totalOutputSize = 0;
  const startTime = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath  = join(INPUT_DIR, file);
    const outputName = basename(file, '.png') + '.webp';
    const outputPath = join(OUTPUT_DIR, outputName);

    const inputStat = await import('fs').then(fs => fs.promises.stat(inputPath));
    totalInputSize += inputStat.size;

    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY, effort: 4 }) // effort 4 = faster encode, still small
      .toFile(outputPath);

    const outputStat = await import('fs').then(fs => fs.promises.stat(outputPath));
    totalOutputSize += outputStat.size;

    // Progress every 10 files
    if ((i + 1) % 10 === 0 || i === files.length - 1) {
      const pct = Math.round(((i + 1) / files.length) * 100);
      process.stdout.write(`\r  Progress: ${i + 1}/${files.length} (${pct}%)`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const savedMB  = ((totalInputSize - totalOutputSize) / 1024 / 1024).toFixed(1);
  const savedPct = Math.round((1 - totalOutputSize / totalInputSize) * 100);

  console.log('\n');
  console.log('✅ Conversion complete!');
  console.log(`   Input:  ${(totalInputSize  / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Output: ${(totalOutputSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Saved:  ${savedMB} MB (${savedPct}% reduction)`);
  console.log(`   Time:   ${elapsed}s`);
}

main().catch(console.error);
