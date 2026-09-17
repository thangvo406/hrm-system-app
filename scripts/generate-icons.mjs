/**
 * Reads all .svg files from src/assets/icons/ and regenerates:
 *   - src/assets/icons/index.ts   (registry + IconName type)
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
const ICONS_DIR = path.join(__dirname, '../src/assets/icons');

const svgFiles = readdirSync(ICONS_DIR)
  .filter(f => path.extname(f).toLowerCase() === '.svg')
  .toSorted();

if (svgFiles.length === 0) {
  console.warn('No SVG files found in', ICONS_DIR);
  process.exit(0);
}

const entries = svgFiles.map(file => ({
  name: path.basename(file, '.svg'),
  file,
}));

// camelCase the name so it's a valid JS identifier and importable as component
const toCamelCase = str =>
  str.replaceAll(/-([a-z])/g, (_, c) => c.toUpperCase());

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

await writeFormatted(path.join(ICONS_DIR, 'index.ts'), content);
console.log('Updated src/assets/icons/index.ts');
console.log(`Done — ${entries.length} icon(s): ${entries.map(e => e.name).join(', ')}`);
