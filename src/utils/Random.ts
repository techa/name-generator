function integer(min: number, max: number): number {
	return Math.floor((max - min + 1) * Math.random() + min);
}

function pickOne(array: string): string;
function pickOne<T>(array: Array<T>): T;
function pickOne<T>(array: Array<T> | string): T | string {
	return array[Math.floor(array.length * Math.random())];
}

// word -----------------------------

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

const vowels = 'aiueo';
const vowels2 = ['ai', 'ei', 'oi', 'au', 'eu', 'ou'];
const lastVowels = 'aieoy';
function pickVowel(last = false) {
	return last
		? pickOne(lastVowels)
		: Math.random() > 0.2
		? pickOne(vowels)
		: pickOne(vowels2);
}
function isVowel(str: string) {
	return /[aiueoy]$/i.test(str);
}

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
function pickConsonant(last = false) {
	return last
		? pickOne(lastConsonants)
		: Math.random() > 0.5
		? pickOne(consonants)
		: pickOne(consonants2);
}

const preLetters = [...vowels, ...consonants, ...preConsonants];

export function word(min = 4, max = 6, cap = true) {
	let str = pickOne(preLetters);
	const len = integer(min, max);
	while (str.length < len) {
		const last = len - str.length === 1;
		str += isVowel(str) ? pickConsonant(last) : pickVowel(last);
	}

	if (!isVowel(str) && !lastConsonants.includes(str[len - 1])) {
		console.log('  str', str);
		str = str.slice(0, -1) + pickVowel(true);
	}

	return cap ? str[0].toUpperCase() + str.slice(1) : str;
}

/**
 * @module
 * Pseudo-Random Utility
 *
 * A pseudo-random utility to add seeded random support for help in
 * generating things like terrain or reproducible randomness. Uses the
 * [Mersenne Twister](https://en.wikipedia.org/wiki/Mersenne_Twister) algorithm.
 */

/**
 * 32-bit mask
 */
const BITMASK32 = 0xffffffff;

// Separation point of one one word, the number of bits in the lower bitmask 0 <= r <= w-1
const LOWERMASK = 0x7fffffff; // 31 bits same as _r
const UPPERMASK = 0x80000000; // 34 high bits

// Word size, 64 bits
const WORD_SIZE = 32;

// Degree of recurrence
const _n = 624;
// Middle word, an offset used in the recurrence defining the series x, 1<=m<n
const _m = 397;
const _f = 1812433253;

// const MAX_INT = 9007199254740991;
// const MIN_INT = -MAX_INT;

/**
 * Pseudo-random number generator following the Mersenne_Twister algorithm. Given a seed this generator will produce the same sequence
 * of numbers each time it is called.
 * See https://en.wikipedia.org/wiki/Mersenne_Twister for more details.
 * Uses the MT19937-32 (2002) implementation documented here http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/emt19937ar.html
 *
 * Api inspired by http://chancejs.com/# https://github.com/chancejs/chancejs
 */
export class Random {
	#seed: number | string;
	get seed() {
		return this.#seed;
	}
	#mt: number[];
	#i: number;

	/**
	 * If no seed is specified, the Date.now() is used
	 */
	constructor(seed?: number | string) {
		// save seed
		this.#seed = seed ||= Date.now();

		if (typeof seed === 'string') {
			seed = this.#hash(seed);
		}

		this.#mt = new Array<number>(_n);
		// need to mask to support higher bit machines
		this.#mt[0] = seed >>> 0;

		for (let i = 1; i < _n; i++) {
			const s = this.#mt[i - 1] ^ (this.#mt[i - 1] >>> (WORD_SIZE - 2));
			// numbers are bigger than the JS max safe int, add in 16-bit chunks to prevent IEEE rounding errors on high bits
			this.#mt[i] =
				(((_f * ((s & 0xffff0000) >>> 16)) << 16) +
					_f * (s & 0xffff) +
					i) >>>
				0;
		}
		this.#i = _n;
	}

	#hash(seed: string): number {
		// simple hash
		let hash = 0;
		for (let i = 0; i < seed.length; i++) {
			hash = seed.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
		}
		return hash;
	}

	/**
	 * Apply the twist
	 */
	#twist(): void {
		// coefficients of teh rational normal form twist matrix. _a = 0x9908b0df
		const mag01 = [0x0, 0x9908b0df];
		let y = 0,
			i = 0;
		for (; i < _n - _m; i++) {
			y = (this.#mt[i] & UPPERMASK) | (this.#mt[i + 1] & LOWERMASK);
			this.#mt[i] =
				this.#mt[i + _m] ^ (y >>> 1) ^ (mag01[y & 0x1] & BITMASK32);
		}
		for (; i < _n - 1; i++) {
			y = (this.#mt[i] & UPPERMASK) | (this.#mt[i + 1] & LOWERMASK);
			this.#mt[i] =
				this.#mt[i + (_m - _n)] ^
				(y >>> 1) ^
				(mag01[y & 0x1] & BITMASK32);
		}
		y = (this.#mt[_n - 1] & UPPERMASK) | (this.#mt[0] & LOWERMASK);
		this.#mt[_n - 1] =
			this.#mt[_m - 1] ^ (y >>> 1) ^ (mag01[y & 0x1] & BITMASK32);

		this.#i = 0;
	}

	/**
	 * Return next 32 bit integer number in sequence
	 */
	nextInt(): number {
		if (this.#i >= _n) {
			this.#twist();
		}

		let y = this.#mt[this.#i++];

		// tempering bit shifts and masks
		y ^= y >>> 11;
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= y >>> 18;

		return y >>> 0;
	}

	/**
	 * Return a random floating point number between [0, 1)
	 */
	next(): number {
		return this.nextInt() * (1.0 / 4294967296.0); // divided by 2^32
	}

	/**
	 * Return a random floating point in range [min, max) min is included, max is not included
	 */
	floating(min: number, max: number): number {
		return (max - min) * this.next() + min;
	}

	static floating(min: number, max: number): number {
		return (max - min) * Math.random() + min;
	}

	/**
	 * Return a random integer in range [min, max] min is included, max is included.
	 * Implemented with rejection sampling, see https://medium.com/@betable/tifu-by-using-math-random-f1c308c4fd9d#.i13tdiu5a
	 */
	integer(min: number, max: number): number {
		return Math.floor((max - min + 1) * this.next() + min);
	}

	static integer = integer;

	/**
	 * Returns true or false randomly with 50/50 odds by default.
	 * By default the likelihood of returning a true is .5 (50%).
	 * @param likelihood takes values between [0, 1]
	 */
	bool(likelihood = 0.5): boolean {
		return this.next() <= likelihood;
	}

	static bool(likelihood = 0.5): boolean {
		return Math.random() <= likelihood;
	}

	/**
	 * Returns one element from an array at random
	 */
	pickOne(array: string): string;
	pickOne<T>(array: Array<T>): T;
	pickOne<T>(array: Array<T> | string): T | string {
		return array[this.integer(0, array.length - 1)];
	}
	static pickOne = pickOne;

	/**
	 * Returns a new array random picking elements from the original
	 * @param array Original array to pick from
	 * @param numPicks can be any positive number
	 * @param allowDuplicates indicates whether the returned set is allowed duplicates (it does not mean there will always be duplicates
	 * just that it is possible)
	 */
	pickSet<T>(
		array: Array<T>,
		numPicks: number,
		allowDuplicates = false,
	): Array<T> {
		if (allowDuplicates) {
			return this._pickSetWithDuplicates(array, numPicks);
		} else {
			return this._pickSetWithoutDuplicates(array, numPicks);
		}
	}

	/**
	 * Returns a new array randomly picking elements in the original (not reused)
	 * @param array Array to pick elements out of
	 * @param numPicks must be less than or equal to the number of elements in the array.
	 */
	private _pickSetWithoutDuplicates<T>(
		array: Array<T>,
		numPicks: number,
	): Array<T> {
		if (numPicks > array.length || numPicks < 0) {
			throw new Error(
				'Invalid number of elements to pick, must pick a value 0 < n <= length',
			);
		}
		if (numPicks === array.length) {
			return array;
		}

		const result: Array<T> = new Array<T>(numPicks);
		let currentPick = 0;
		const tempArray = array.slice(0);
		while (currentPick < numPicks) {
			const index = this.integer(0, tempArray.length - 1);
			result[currentPick++] = tempArray[index];
			tempArray.splice(index, 1);
		}

		return result;
	}

	/**
	 * Returns a new array random picking elements from the original allowing duplicates
	 * @param array Array to pick elements out of
	 * @param numPicks can be any positive number
	 */
	private _pickSetWithDuplicates<T>(
		array: Array<T>,
		numPicks: number,
	): Array<T> {
		// Typescript numbers are all floating point, so do we add check for int? (or floor the input?)
		if (numPicks < 0) {
			throw new Error(
				'Invalid number of elements to pick, must pick a value 0 <= n < MAX_INT',
			);
		}
		const result = new Array<T>(numPicks);
		for (let i = 0; i < numPicks; i++) {
			result[i] = this.pickOne(array);
		}
		return result;
	}

	/**
	 * Returns a new array that has its elements shuffled. Using the Fisher/Yates method
	 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	 */
	shuffle<T>(array: Array<T>): Array<T> {
		const tempArray = array.slice(0);
		let swap: T = null;
		for (let i = 0; i < tempArray.length - 2; i++) {
			const randomIndex = this.integer(i, tempArray.length - 1);
			swap = tempArray[i];
			tempArray[i] = tempArray[randomIndex];
			tempArray[randomIndex] = swap;
		}

		return tempArray;
	}

	/**
	 * Generate a list of random integer numbers
	 * @param length the length of the final array
	 * @param min the minimum integer number to generate inclusive
	 * @param max the maximum integer number to generate inclusive
	 */
	range(length: number, min: number, max: number): Array<number> {
		const result: Array<number> = new Array(length);
		for (let i = 0; i < length; i++) {
			result[i] = this.integer(min, max);
		}
		return result;
	}

	/**
	 * @param sided the number of faces of each dice, 2 <= sided
	 * @param times the number of dice to be rolled, 1 <= times
	 */
	dice(sided: number, times = 1): number {
		if (sided < 2 || times < 1) {
			throw new Error(
				'Invalid number, must sided a value 2 <= n, must times a value 1 <= n.',
			);
		}
		let result = 0;
		while (times--) {
			result += this.integer(1, sided);
		}
		return result;
	}

	/**
	 * @see https://en.wikipedia.org/wiki/Dice_notation
	 * @param dice
	 */
	rpg(dice: `${number}${'d' | 'D'}${number}`): number {
		const [times, sided] = dice.split(/d/i).map((n) => +n || 1);
		return this.dice(sided, times);
	}

	/**
	 * Randomly index by odds
	 * @example
	 * [3, 2] -> 0:60%, 1:40%
	 * [1, 2] -> 0:33.333%, 1:66.666%
	 * [1, 4, 1, 2, 2] -> 0:10%, 1:40%, 2:10%, 3:20%, 4:20%
	 * @param odds array of odds
	 */
	indexByOdds(odds: number[]): number {
		const total = odds.reduce((prev, n) => prev + n, 0);
		const rate = total * this.floating(0, 1);
		let border = 0;
		for (let i = 0; i < odds.length; i++) {
			border += odds[i];
			if (rate < border) {
				return i;
			}
		}
	}
}
