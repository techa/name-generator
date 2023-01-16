import { random, type Random } from '../utils/random/Random.js';
import { syllable } from '../utils/syllable.js';
import { Translator } from './Translator.js';

export interface NamePart {
	nameExp: string;
	tag: 'first' | 'family';

	prefix: boolean;
	suffix: boolean;
}

export interface Options {
	resource?: string | string[];
	nameLength?: number;
	nameLengthMin?: number;
	nameLengthMax?: number;
}

interface NgData {
	char: string;
	nexts: Record<string, number>;
	// next count total
	total: number;
}

export interface CreateOptions {
	random: Random;
	// number of letters
	count: number | [number, number];
}

export interface NameResult {
	exp: string;
	kana: string;
	syllables: number;
	// Does it exist in the source?
	exist: boolean;
}

/**
 * Syllable-Gram
 */
export class NameGenerator {
	minSyllable = 2;
	maxSyllable = 8;
	data: Record<string, NgData> = {};
	names: Set<string> = new Set();

	translator = new Translator();

	random = random;

	clear() {
		this.data = {};
		this.names = new Set();
	}

	add(list: string[], kana = false) {
		for (let i = 0; i < list.length; i++) {
			const word = kana ? this.translator.fromKana(list[i]) : list[i];

			if (!word) {
				continue;
			}

			this.names.add(word);

			const syllables = syllable(word);

			this.set('^', syllables[0]);

			for (let j = 0; j < syllables.length; j += 1) {
				const char = syllables[j];
				const next = syllables[j + 1] || '$';
				if (char && next) {
					this.set(char, next);
				}
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

	create(opts: Partial<CreateOptions> = {}): NameResult {
		if (opts.random != null) {
			this.random = opts.random;
		}
		let count =
			typeof opts.count === 'number'
				? opts.count
				: this.random.int(
						...(opts.count || [this.minSyllable, this.maxSyllable]),
				  );
		let syllables = 0;

		let product = '';
		let prev = '^';

		while (count--) {
			const data = this.data[prev];

			const total =
				data.total -
				((syllables < this.minSyllable && data.nexts.$) || 0);
			const rate = total * this.random.float(0, 1);
			let border = 0;

			// 長くなりすぎないように切りの良いところで切る
			// Cut at the cut-off point so that it is not too long.
			if (data.nexts.$ && syllables > 4) {
				break;
			}

			for (const key in data.nexts) {
				if (
					key === '$' &&
					syllables < this.minSyllable &&
					data.nexts.$
				) {
					continue;
				}
				if (rate <= (border += data.nexts[key])) {
					prev = key;
					break;
				}
			}

			if (!prev || prev === '$') {
				break;
			}
			if (prev.endsWith(' ')) {
				count++;
			}

			// 繰り返し防止
			// je-n,kimなどがje-nje-n,kimkimになる
			// 繰り返しが起きる原因は
			// ・je-nが語頭
			// ・this.data['je-n'].nextsに$だけ
			// 以上の２つの条件を満たしたとき
			// prevの参照がje-nのままwhileループ２回目を回すことになる
			// この対処法(product !== prev)だとsyllables=1のデータも出力することになる
			if (product !== prev) {
				product += prev;
				syllables++;
			}
		}

		return {
			exp: product,
			kana: this.translator.toKana(product),
			syllables,
			exist: this.names.has(product),
		};
	}

	/**
	 *
	 * [?-nm]e[nm]a
	 * [?-l]e(l)[nm]a
	 * @param rule
	 */
	parseRule(rule: string) {
		//
	}
	/**
	 *
	 * @param rule
	 */
	creaty(rule: string) {
		//
	}
}
