// node ./scripts/expToJs.js
import { readFileSync, writeFileSync } from 'fs';

const types = ['family', 'female', 'male'];
const langs = [
	'en',
	'de',
	'fr',
	'it',
	'es',
	'sv',
	'fi',
	'ru',
	'cs',
	'nl',
	'ar',
];

let t =
	"export const types = ['family', 'female', 'male'] as const;\n" +
	`export const langs = ${JSON.stringify(langs)} as const;\n`;
let obj = `\nexport const all = {`;

for (const type of types) {
	obj += `${type}: {\n`;
	for (const lang of langs) {
		const text = readFileSync(
			`./resource/exp/${type}-${lang}.txt`,
			'utf-8',
		).replace(/\n(\n|$)/g, '');

		t += `export const ${type}_${lang} = \`${text}\`.split('\\n');\n`;
		obj += `${lang}: ${type}_${lang},\n`;
	}
	obj += `},\n`;
}
obj += `}\n`;

writeFileSync(`./src/constants/sources.ts`, t + obj);
