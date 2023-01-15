import { readFileSync, writeFile } from 'fs';
import { NameExp } from '../src/lib/NameExp.js';
import { types, langs } from './constants.js';

function save(data: Record<string, Pattern>, filename: string) {
	writeFile(
		`./resource/pattern/${filename}.js`,
		`export default ${JSON.stringify(data, null, '\t')}`,
		(err) => {
			if (err) console.error(err);
		},
	);
	// writeFile(
	// 	`./resource/pattern/${filename}.json`,
	// 	JSON.stringify(data, null, '\t'),
	// 	(err) => {
	// 		if (err) console.error(err);
	// 	},
	// );
}

interface Pattern {
	count: number;
	prevs: Record<string, number>;
	nexts: Record<string, number>;
}

let all: Record<string, Pattern> = {};

const sum = <T extends Record<string, number>>(el1: T, el2: T): T => {
	const result: Record<keyof typeof el1 | keyof typeof el2, number> = {
		...el1,
	} as T;

	for (const key2 in el2) {
		result[key2] ??= 0;
		result[key2] += el2[key2];
	}
	return result as T;
};

const dataCombine = (data: Record<string, Pattern>) => {
	let change = false;
	for (const key1 in data) {
		for (const key2 in data) {
			if (key1 !== key2 && data[key1] && data[key2]) {
				const element1 = data[key1];
				const element2 = data[key2];
				const comb = new NameExp(key1).combine(key2);

				if (comb) {
					data[comb] = {
						count: element1.count + element2.count,
						prevs: sum(element1.prevs, element2.prevs),
						nexts: sum(element1.nexts, element2.nexts),
					};
					delete data[key1];
					delete data[key2];
					change = true;
				}
			}
		}
	}
	return change;
};

const dataSort = (data: Record<string, Pattern>): Record<string, Pattern> =>
	Object.entries(data)
		.sort(([, n1], [, n2]) => n2.count - n1.count)
		.reduce((obj, [key, val]) => {
			obj[key] = val;
			return obj;
		}, {} as Record<string, Pattern>);

for (const type of types) {
	let typesData: Record<string, Pattern> = {};

	for (const lang of langs) {
		const line = readFileSync(
			`./resource/exp/${type}-${lang}.txt`,
			'utf-8',
		).split('\n');

		let map: Record<string, Pattern> = {};

		const after: string[] = [];

		const dataAdd = (
			data: Record<string, Pattern>,
			match: string,
			prev: string,
			next: string,
		) => {
			data[match] ??= {
				count: 0,
				prevs: {},
				nexts: {},
			};
			data[match].count += 1;
			data[match].prevs[prev] ??= 0;
			data[match].prevs[prev] += 1;
			data[match].nexts[next] ??= 0;
			data[match].nexts[next] += 1;
		};

		for (const _word of line) {
			let word = _word;
			let m = 0;
			let prev = '^';
			let prevIndex = -1;
			while (word.length > 2 && m++ < 4) {
				word = word.replace(
					/^\w?[aeiou][-~]?\w[aeiou]?(\S[aeiou]?(?=$))?/i,
					(match) => {
						if (m === 1 && word === match) {
							after.push(word);
							return '';
						}

						const next = word[match.length] || '$';

						dataAdd(map, match, prev, next);
						dataAdd(typesData, match, prev, next);
						dataAdd(all, match, prev, next);

						prevIndex += match.length;
						prev = _word[prevIndex];

						return '';
					},
				);
			}
		}

		map = dataSort(map);
		while (dataCombine(map));

		save(dataSort(map), `${type}-${lang}`);
	}

	typesData = dataSort(typesData);
	dataCombine(typesData);

	save(dataSort(typesData), `${type}`);
}

all = dataSort(all);
dataCombine(all);

save(dataSort(all), `all`);
