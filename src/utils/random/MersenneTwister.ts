import { Random } from './Random.js';

// const MAX_INT = 9007199254740991;
// const MIN_INT = -MAX_INT;

/**
 * @module
 * Pseudo-Random Utility
 *
 * A pseudo-random utility to add seeded random support for help in
 * generating things like terrain or reproducible randomness. Uses the
 * [Mersenne Twister](https://en.wikipedia.org/wiki/Mersenne_Twister) algorithm.
 *
 * Pseudo-random number generator following the Mersenne_Twister algorithm. Given a seed this generator will produce the same sequence
 * of numbers each time it is called.
 * See https://en.wikipedia.org/wiki/Mersenne_Twister for more details.
 * Uses the MT19937-32 (2002) implementation documented here http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/emt19937ar.html
 *
 * Api inspired by http://chancejs.com/# https://github.com/chancejs/chancejs
 */
export class MersenneTwister extends Random {
	#seed: number | string;
	get seed() {
		return this.#seed;
	}
	// Degree of recurrence
	#n = 624;
	#mt: number[];
	#i: number;

	/**
	 * If no seed is specified, the Date.now() is used
	 */
	constructor(seed?: number | string) {
		super();
		// save seed
		this.#seed = seed ||= Date.now();

		if (typeof seed === 'string') {
			seed = this.#hash(seed);
		}

		this.#mt = new Array<number>(this.#n);
		// need to mask to support higher bit machines
		this.#mt[0] = seed >>> 0;

		// Word size, 64 bits
		const WORD_SIZE = 32;
		const _f = 1812433253;

		for (let i = 1; i < this.#n; i++) {
			const s = this.#mt[i - 1] ^ (this.#mt[i - 1] >>> (WORD_SIZE - 2));
			// numbers are bigger than the JS max safe int, add in 16-bit chunks to prevent IEEE rounding errors on high bits
			this.#mt[i] =
				(((_f * ((s & 0xffff0000) >>> 16)) << 16) +
					_f * (s & 0xffff) +
					i) >>>
				0;
		}
		this.#i = this.#n;
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
		/**
		 * 32-bit mask
		 */
		const BITMASK32 = 0xffffffff;

		// Separation point of one one word, the number of bits in the lower bitmask 0 <= r <= w-1
		const LOWERMASK = 0x7fffffff; // 31 bits same as _r
		const UPPERMASK = 0x80000000; // 34 high bits

		// coefficients of teh rational normal form twist matrix. _a = 0x9908b0df
		const mag01 = [0x0, 0x9908b0df];
		let y = 0,
			i = 0;

		// Middle word, an offset used in the recurrence defining the series x, 1<=m<n
		const _m = 397;
		for (; i < this.#n - _m; i++) {
			y = (this.#mt[i] & UPPERMASK) | (this.#mt[i + 1] & LOWERMASK);
			this.#mt[i] =
				this.#mt[i + _m] ^ (y >>> 1) ^ (mag01[y & 0x1] & BITMASK32);
		}
		for (; i < this.#n - 1; i++) {
			y = (this.#mt[i] & UPPERMASK) | (this.#mt[i + 1] & LOWERMASK);
			this.#mt[i] =
				this.#mt[i + (_m - this.#n)] ^
				(y >>> 1) ^
				(mag01[y & 0x1] & BITMASK32);
		}
		y = (this.#mt[this.#n - 1] & UPPERMASK) | (this.#mt[0] & LOWERMASK);
		this.#mt[this.#n - 1] =
			this.#mt[_m - 1] ^ (y >>> 1) ^ (mag01[y & 0x1] & BITMASK32);

		this.#i = 0;
	}

	/**
	 * Return next 32 bit integer number in sequence
	 */
	#nextInt(): number {
		if (this.#i >= this.#n) {
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
		return this.#nextInt() * (1.0 / 4294967296.0); // divided by 2^32
	}
}
