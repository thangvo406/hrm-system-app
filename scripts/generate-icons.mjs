/**
 * Reads all .svg files from src/assets/icons/ and regenerates:
 *   - src/assets/icons/index.ts   (registry + IconName type)
 */

import { readdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ICONS_DIR = join(__dirname, '../src/assets/icons');

const svgFiles = readdirSync(ICONS_DIR)
  .filter(f => extname(f).toLowerCase() === '.svg')
  .sort();

if (svgFiles.length === 0) {
  console.warn('No SVG files found in', ICONS_DIR);
  process.exit(0);
}

const entries = svgFiles.map(file => ({
  name: basename(file, '.svg'),
  file,
}));

// camelCase the name so it's a valid JS identifier and importable as component
const toCamelCase = str =>
  str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const importLines = entries.map(
  ({ name, file }) =>
    `import ${toCamelCase(name[0].toUpperCase() + name.slice(1))}Icon from './${file}';`,
);

const registryLines = entries.map(({ name }) => {
  const pascal = toCamelCase(name[0].toUpperCase() + name.slice(1));
  return `  '${name}': ${pascal}Icon,`;
});

const content = `${importLines.join('\n')}

const icons = {
${registryLines.join('\n')}
} as const;

export type IconName = keyof typeof icons;

export default icons;
`;

writeFileSync(join(ICONS_DIR, 'index.ts'), content);
console.log('Updated src/assets/icons/index.ts');
console.log(`Done — ${entries.length} icon(s): ${entries.map(e => e.name).join(', ')}`);
