import { Random } from '../utils/Random.js';

interface NgramData {
	char: string;
	nexts: Record<string, number>;
	// next count total
	total: number;
}

export interface CreateOptions {
	seed: number | string;
	// number of letters
	count: number | [number, number];
}

export class Ngram {
	n = 2;
	prefix = true;
	suffix = true;
	data: Record<string, NgramData> = {};

	random = new Random();

	clear() {
		this.data = {};
	}

	add(list: string[]) {
		for (let i = 0; i < list.length; i++) {
			const word = list[i];

			if (!word) {
				continue;
			}

			if (this.prefix) {
				this.set('^', word.slice(0, 1));
			}

			for (let j = 0; j <= word.length - this.n; j += 1) {
				const char = word.slice(j, j + this.n);
				const next = word.slice(j + this.n, j + this.n + 1) || '$';
				this.set(char, next);
			}
		}
	}

	set(char: string, next: string) {
		const data = this.data[char] || {
			char,
			nexts: {},
			total: 0,
		};
		data.nexts[next] ||= 0;

		data.total += 1;
		data.nexts[next] += 1;

		this.data[char] = data;
	}

	create(opts: Partial<CreateOptions> = {}) {
		if (opts.seed != null) {
			this.random = new Random(opts.seed);
		}
		const wordCount =
			typeof opts.count === 'number'
				? opts.count
				: this.random.integer(...(opts.count || [3, 10]));

		let product = '';
		let next = '^';

		const keys = Object.keys(this.data);

		while (product.length < wordCount) {
			if (next === '$') {
				break;
			}
			const adds = keys.filter((v) => v.startsWith(next));
			const add = this.random.pickOne(adds);
			const data = this.data[add];

			// console.log(add, data);
			if (!data) {
				console.log(add, data);
				break;
			}

			const rate = data.total * this.random.floating(0, 1);
			let border = 0;
			for (const key in data.nexts) {
				const count = data.nexts[key];
				border += count;
				if (rate <= border) {
					product += add === '^' ? '' : add;
					next = key;
					break;
				}
			}
		}
		return product;
	}
}
