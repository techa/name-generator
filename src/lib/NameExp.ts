import '../global/string/trade.js';
import { consonants } from '../constants/char.js';
import { isConsonant, isVowel } from '../utils/vc.js';

export interface CharData {
	index: number;
	source: string;
	chars: string[];
	excludeRight?: number;
	excludeLeft?: number;
}

export class NameExp {
	static charMax = 20;

	readonly source: string;
	datas: CharData[];

	constructor(source: string) {
		this.source = source;
		this.#parse(source);
	}

	random = (min: number, max: number) =>
		Math.floor(min + Math.random() * (max - min + 1));

	#parse(source: string) {
		let index = 0;
		const result: CharData[] = [];
		const replacer = (source: string, p1: string, p2: string) => {
			const chars = (p1 === '?' ? consonants : p1).split('');
			const res: CharData = {
				index,
				source,
				chars,
				// excludeRight: false,
				// excludeLeft: false,
			};

			// after minus
			if (p2) {
				p2 = p2.slice(1);
				for (let i = 0; i < p2.length; i++) {
					const del = p2[i];
					if (chars.includes(del)) {
						chars.splice(chars.indexOf(del), 1);
					} else {
						switch (del) {
							case '>':
								res.excludeRight += 1;
								break;
							case '<':
								res.excludeLeft -= 1;
								break;

							default:
								break;
						}
					}
				}
			}
			result.push(res);
			index++;
			return '';
		};

		let countDown = NameExp.charMax;
		while (source) {
			source = source.replace(/^([^[(])/, replacer);
			source = source.replace(/^\[(.+?)(-[\w><]+)?\]/, replacer);

			if (!--countDown) {
				throw new Error('Invalid NameExp source string');
			}
		}
		this.datas = result;
		return result;
	}

	isMultiple(): boolean {
		return this.datas.some((v) => v.chars.length > 1);
	}

	test(str: string): boolean {
		let result = true;
		const datas = this.datas;
		for (let i = 0; i < str.length && result; i++) {
			const char = str[i];
			result = datas[i].chars.includes(char);
		}
		return result;
	}

	pick(): string {
		let result = '';
		const datas = this.datas;
		for (const { chars } of datas) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}

		for (const data of datas) {
			const { chars } = data;
			const offset = chars.indexOf(result[data.index + 1]);
			if (data.excludeRight && offset > -1) {
				result =
					result.slice(0, offset) +
					chars[Math.floor(Math.random() * chars.length)] +
					result.slice(offset + 1);
			}
		}
		return result;
	}

	#exclude(result: string) {
		for (const data of this.datas) {
			const { chars } = data;
			const offset = chars.indexOf(result[data.index + 1]);
			if (data.excludeRight && offset > -1) {
				result =
					result.slice(0, offset) +
					chars[Math.floor(Math.random() * chars.length)] +
					result.slice(offset + 1);
			}
		}
		return result;
	}

	spreadAll() {
		const datas = this.datas;
		let results = datas[0].chars;
		for (let i = 1; i < datas.length; i++) {
			const chars = datas[i].chars;
			const _result = [];
			for (let j = 0; j < results.length; j++) {
				for (let k = 0; k < chars.length; k++) {
					_result.push(results[j] + chars[k]);
				}
			}
			results = _result;
		}

		return results;
	}

	toString() {
		let str = '';
		for (let i = 0; i < this.datas.length; i++) {
			const { chars } = this.datas[i];
			if (chars.length > 1) {
				str += '[' + chars.sort().join('') + ']';
			} else {
				str += chars[0];
			}
		}
		return str;
	}

	/**
	 *
	 * @param source
	 * @returns
	 */
	combine(source: string): string {
		let diffIndex = -1;
		let diffCount = 0;
		const nexp = new NameExp(source);

		type Checker = (char: string) => boolean;
		const test = (checker: Checker, checker2?: Checker) => {
			// 文字数が同じでない場合
			if (this.datas.length !== nexp.datas.length) {
				return;
			}
			for (let i = 0; i < this.datas.length; i++) {
				const data1 = this.datas[i];
				const data2 = nexp.datas[i];

				// 比較して文字の差異がある場合
				if (data2.chars.some((v) => !data1.chars.includes(v))) {
					const char1 = data1.chars[0];
					const char2 = data2.chars[0];

					if (checker(char1) && checker(char2)) {
						diffIndex = i;
						diffCount++;
					} else if (checker2 && checker2(char1) && checker2(char2)) {
						diffIndex = i;
						diffCount++;
					}
				}
			}
		};

		test(isVowel);
		test(isConsonant);

		if (diffIndex < 0 && !diffCount) {
			return this.toString();
		}

		if (
			diffCount > 1 ||
			(this.isMultiple() &&
				this.datas.findIndex((v) => v.chars.length > 1) !== diffIndex)
		) {
			// console.log(this.source, source);
			// console.log('diffCount', diffCount);
			return;
		}

		this.datas[diffIndex].chars.push(...nexp.datas[diffIndex].chars);

		return this.toString();
	}
}
