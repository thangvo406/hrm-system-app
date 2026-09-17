/**
 * Reads all image files from src/assets/images/ and regenerates:
 *   - src/assets/images/index.ts   (registry + ImageName type)
 *   - src/assets/images/names.ts   (plain array of all image names)
 */

import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';

// Ghi qua prettier để registry sinh ra luôn đạt `yarn lint:code-format`.
const writeFormatted = async (filePath, source) => {
  const options = await resolveConfig(filePath);
  writeFileSync(filePath, await format(source, { ...options, filepath: filePath }));
};

const __dirname = import.meta.dirname;
const IMAGES_DIR = path.join(__dirname, '../src/assets/images');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

const imageFiles = readdirSync(IMAGES_DIR)
  .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
  .toSorted();

if (imageFiles.length === 0) {
  console.warn('No image files found in', IMAGES_DIR);
  process.exit(0);
}

const entries = imageFiles.map(file => {
  const name = path.basename(file, path.extname(file));
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

await writeFormatted(path.join(IMAGES_DIR, 'index.ts'), indexContent);
console.log('Updated src/assets/images/index.ts');

// --- generate names.ts ---
const namesContent = `import type { ImageName } from './index';

const imageNames = {
${entries.map(({ name }) => `  ${name}: '${name}',`).join('\n')}
} as const satisfies Record<string, ImageName>;

export default imageNames;
`;

await writeFormatted(path.join(IMAGES_DIR, 'names.ts'), namesContent);
console.log('Updated src/assets/images/names.ts');

console.log(`Done — ${entries.length} image(s): ${entries.map(e => e.name).join(', ')}`);
