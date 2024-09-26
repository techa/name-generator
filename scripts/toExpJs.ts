// npx tsx ./scripts/toExpJs.ts nord
// pnpm tsx ./scripts/toExpJs.ts nord
// node ./scripts/toExpJs.js nord
import { readFileSync, writeFileSync } from 'fs';
import { Phonation } from '../src/lib/Phonation.js';

const phonation = new Phonation();
const [, , title] = process.argv;

const filePath = `./src/constants/${title}.ts`;
const jstext = readFileSync(filePath, 'utf-8');
const sep = '// Phonation Data\n';
const beginDataIndex = jstext.indexOf(sep) + sep.length;
const groups = await import('.' + filePath).then((modules) => modules.groups);
const keys = Object.keys(groups);

let t = jstext.slice(0, beginDataIndex);
let lists = `\nexport const lists = {\n`;

for (const key of keys) {
	const text = readFileSync(`./resource/${title}/${key}.txt`, 'utf-8')
		.split(/\n(?:\n|$)*/)
		.reduce((acc, v) => {
			// Avoid redundancy
			if (!acc.includes(v)) acc.push(v);
			return acc;
		}, [] as string[])
		.map((kana) => kana && phonation.fromKana(kana))
		.join('\n');

	t += `export const ${key} = \`${text}\`.split('\\n');\n`;
	lists += `${key},\n`;
}
lists += `}\n`;

writeFileSync(`./src/constants/${title}.ts`, t + lists);
