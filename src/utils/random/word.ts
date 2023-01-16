import { random } from './Random.js';

function combination(arr1: Iterable<string>, arr2: Iterable<string>) {
	const result: string[] = [];
	for (const val1 of arr1) {
		for (const val2 of arr2) {
			// callback
			result.push(val1 + val2);
		}
	}
	return result;
}
function isVowel(str: string) {
	return /[aiueoy]$/i.test(str);
}

const vowels = 'aiueo';
const vowels2 = ['ai', 'ei', 'oi', 'au', 'eu', 'ou'];
const lastVowels = 'aieoy';

const consonants = 'dzjbvgtscpfkrlmn';
const tr = combination('tdspfkbvg', 'rl');
const th = combination('tscp', 'h');
const preConsonants = [...combination('s', 'bvgtcpfk'), ...tr, ...th];
const consonants2 = [
	'mb',
	'mp',
	'ck',
	...combination('szftlp', 'szftlp'),
	...tr,
	...th,
	...combination('n', 'dzjvgtscfkrl'),
];
const lastConsonants = [...'dzgtscpkrlmnx'];
const preLetters = [...vowels, ...consonants, ...preConsonants];

export interface WordParams {
	min?: number;
	max?: number;
	capitarize?: boolean;
}

export class Word {
	min = 2;
	max = 6;
	capitarize = false;

	rndm = random;

	constructor(params: WordParams = {}) {
		for (const key in params) {
			this[key] = params[key];
		}
	}

	next() {
		let str = this.rndm.pick(preLetters);
		const len = this.rndm.int(this.min, this.max);
		while (str.length < len) {
			const last = len - str.length === 1;
			str += isVowel(str)
				? this.pickConsonant(last)
				: this.pickVowel(last);
		}

		if (!isVowel(str) && !lastConsonants.includes(str[len - 1])) {
			console.log('  str', str);
			str = str.slice(0, -1) + this.pickVowel(true);
		}

		return this.capitarize ? str[0].toUpperCase() + str.slice(1) : str;
	}

	pickConsonant(last = false) {
		return last
			? this.rndm.pick(lastConsonants)
			: this.rndm.bool()
			? this.rndm.pick(consonants)
			: this.rndm.pick(consonants2);
	}

	pickVowel(last = false) {
		return last
			? this.rndm.pick(lastVowels)
			: this.rndm.bool()
			? this.rndm.pick(vowels)
			: this.rndm.pick(vowels2);
	}
}
