# Location Stamp

Svelte 5 photo tool. Add a bold Inter place name and a second line for street/city. Choose top-left, top-right, bottom-left, or bottom-right. Labels use white text with a soft dark shadow.

PNG downloads preserve the uploaded image's decoded, orientation-corrected pixel dimensions. Only the on-screen preview may be downsampled for speed. The export redraws the original image, never the preview. No image uploads or remote processing. Very large exports remain subject to browser canvas/memory limits; failure is reported rather than silently reducing resolution. Canvas export does not preserve original EXIF metadata or guarantee the original color profile/HDR representation.

Long labels shrink to fit on their respective lines. Files supported: JPG, PNG, WebP (still images).

## Development

Node.js 22+. Run `npm install`, `npm run dev`. Tests: `npm test`. Production: `npm run build`.

## Hosting

GitHub Settings → Pages → Source: GitHub Actions. Pushes to `main` run tests, build and publish the site.
