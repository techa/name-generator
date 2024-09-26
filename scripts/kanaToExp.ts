// pnpm tsx ./scripts/kanaToExp.js
import { readFileSync, writeFileSync } from 'fs';
import { Phonation } from '../src/lib/Phonation.js';
import { types, langs } from './constants.js';

const phonation = new Phonation();

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
			}, [] as string[])
			.map((kana) => phonation.fromKana(kana))
			.join('\n');

		writeFileSync(`./resource/exp/${type}-${lang}.txt`, text);
	}
}

const others = ['jw', 'mt'];
for (const other of others) {
	const text = readFileSync(`./resource/kana/other-${other}.txt`, 'utf-8')
		.split('\n')
		.map((kana) => phonation.fromKana(kana))
		.join('\n');

	writeFileSync(`./resource/exp/other-${other}.txt`, text);
}

if (phonation.fromKanaMissings.size) {
	console.log(phonation.fromKanaMissings);
}
