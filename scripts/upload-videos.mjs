import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/BLOB_READ_WRITE_TOKEN=["']?([^"'\n\r]+)["']?/);
if (tokenMatch) process.env.BLOB_READ_WRITE_TOKEN = tokenMatch[1].trim();

const videos = [
  { file: 'success.mp4', name: 'videos/success.mp4' },
  { file: 'regret.mp4', name: 'videos/regret.mp4' },
  { file: 'nextday-done.mp4', name: 'videos/nextday-done.mp4' },
  { file: 'nextday-notdone.mp4', name: 'videos/nextday-notdone.mp4' },
];

for (const video of videos) {
  const filePath = join(__dirname, '..', 'public', 'videos', video.file);
  console.log(`Uploading ${video.file}...`);
  try {
    const fileBuffer = readFileSync(filePath);
    const blob = await put(video.name, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'video/mp4',
    });
    console.log(`✓ ${video.file} → ${blob.url}`);
  } catch (err) {
    console.error(`✗ ${video.file} failed:`, err.message);
  }
}
