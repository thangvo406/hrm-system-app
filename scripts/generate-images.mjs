/**
 * Reads all image files from src/assets/images/ and regenerates:
 *   - src/assets/images/index.ts   (registry + ImageName type)
 *   - src/assets/images/names.ts   (plain array of all image names)
 */

import { readdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const IMAGES_DIR = join(__dirname, '../src/assets/images');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

const imageFiles = readdirSync(IMAGES_DIR)
  .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
  .sort();

if (imageFiles.length === 0) {
  console.warn('No image files found in', IMAGES_DIR);
  process.exit(0);
}

const entries = imageFiles.map(file => {
  const name = basename(file, extname(file));
  return { name, file };
});

// --- generate index.ts ---
const registryLines = entries.map(({ name, file }) =>
  `  ${name}: require('./${file}') as number,`,
);

const indexContent = `const images = {
${registryLines.join('\n')}
} as const;

export type ImageName = keyof typeof images;

export default images;
`;

writeFileSync(join(IMAGES_DIR, 'index.ts'), indexContent);
console.log('Updated src/assets/images/index.ts');

// --- generate names.ts ---
const namesContent = `import type { ImageName } from './index';

const imageNames: ImageName[] = [
${entries.map(({ name }) => `  '${name}',`).join('\n')}
];

export default imageNames;
`;

writeFileSync(join(IMAGES_DIR, 'names.ts'), namesContent);
console.log('Updated src/assets/images/names.ts');

console.log(`Done — ${entries.length} image(s): ${entries.map(e => e.name).join(', ')}`);
