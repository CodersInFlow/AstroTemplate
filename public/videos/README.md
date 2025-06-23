# Videos Directory

Place your demo videos here. The video player will automatically detect and display them.

## Supported Formats
- `.mp4` (recommended)
- `.webm`
- `.ogg`
- `.mov`

## Naming Convention
- Use descriptive names (e.g., `Feature-Demo.mp4`)
- Spaces, hyphens, and underscores are allowed
- Names will be converted to titles automatically

## Thumbnails (Optional)
To add thumbnails, create a `thumbnails` subdirectory and add images with the same name as the video:
```
videos/
├── Feature-Demo.mp4
└── thumbnails/
    └── Feature-Demo.jpg
```

## How It Works
1. Add videos to this directory
2. Run `npm run build` (or `npm run generate:videos`)
3. The build script automatically generates a video list
4. Videos appear in the "Why We're Better" section

## Notes
- Videos are lazy-loaded for performance
- The player auto-plays the next video
- Users can click any video in the playlist to jump to it
- First video requires user interaction due to browser autoplay policies