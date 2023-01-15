// tsc | node ./.build/scripts/kanaToExp.js
import { readFileSync, writeFileSync } from 'fs';
import { Translator } from '../src/lib/Translator.js';

const types = ['family', 'female', 'male'];
const langs = [
	'en',
	'de',
	'fr',
	'es',
	'it',
	'fi',
	'sv',
	'ru',
	'cs',
	'nl',
	'ar',
];

const translator = new Translator();

for (const type of types) {
	for (const lang of langs) {
		const text = readFileSync(
			`./resource/kana/${type}-${lang}.txt`,
			'utf-8',
		)
			.split('\n')
			.reduce((acc, v) => {
				// Avoid redundancy
				if (!acc.includes(v)) acc.push(v);
				return acc;
			}, [])
			.map((kana) => translator.fromKana(kana))
			.join('\n');

		writeFileSync(`./resource/exp/${type}-${lang}.txt`, text);
	}
}

if (translator.fromKanaMissings.size) {
	console.log(translator.fromKanaMissings);
}
