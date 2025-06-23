import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to videos directory
const videosDir = path.join(__dirname, '../public/videos');
const outputPath = path.join(__dirname, '../src/data/videos.json');

// Supported video formats
const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];

console.log('🎬 Generating video list...');

// Ensure videos directory exists
if (!fs.existsSync(videosDir)) {
  console.log('📁 Creating videos directory...');
  fs.mkdirSync(videosDir, { recursive: true });
}

// Get all video files
const videoFiles = fs.readdirSync(videosDir)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return videoExtensions.includes(ext);
  })
  .sort(); // Sort alphabetically

// Generate video data
const videos = videoFiles.map((filename, index) => {
  const stats = fs.statSync(path.join(videosDir, filename));
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  
  // Convert filename to title (replace underscores/hyphens with spaces, capitalize)
  const title = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    id: index + 1,
    filename: filename,
    title: title,
    url: `/videos/${filename}`,
    thumbnail: `/videos/thumbnails/${nameWithoutExt}.jpg`, // Assume thumbnails exist
    duration: null, // Could be extracted with ffprobe if needed
    size: stats.size,
    description: `Video ${index + 1}` // Can be enhanced with metadata
  };
});

// Ensure data directory exists
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to JSON file
fs.writeFileSync(outputPath, JSON.stringify(videos, null, 2));

console.log(`✅ Generated list of ${videos.length} videos`);
console.log(`📄 Output saved to: src/data/videos.json`);

if (videos.length === 0) {
  console.log('\n⚠️  No videos found in public/videos/');
  console.log('   Add .mp4, .webm, .ogg, or .mov files to see them in the list');
}