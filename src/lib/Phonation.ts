import { toKana, fromKana } from '../constants/kana.js';
import { isConsonant, isVowel } from '../utils/vc.js';

export interface PhonationOptions {
	/**
	 * - https://ja.wikipedia.org/長 (発音記号)
	 *
	 * repeat: サーフィン→`saafin`
	 * -: サーフィン→`sa-fin`
	 */
	longVowel: 'repeat' | '-';
	/**
	 * - https://ja.wikipedia.org/wiki/促音
	 * - https://ja.wikipedia.org/wiki/長子音
	 * - https://ja.wikipedia.org/wiki/っ
	 *
	 * repeat: アップル→`appl`、ルッカ→`lkka`
	 */
	longConsonant: 'repeat' | '~';

	/**
	 * - アップルを `a~pl` とするか `ap~l` とするか。
	 * - ルッカを `l~ka` とするか `lk~a` とするか。
	 *
	 * 日本語話者からすると前者が馴染み深いが国際音声記号では後者で表す
	 */
	longConsonantPosition: 'before' | 'after';

	/**
	 * 子音のないアイウエオを`A`とするか`_a`とするか`a`とするか
	 */
	consonantForVowels: 'capital' | '_' | 'lower';
}

export class Phonation implements PhonationOptions {
	longVowel: PhonationOptions['longVowel'] = '-';
	longConsonant: PhonationOptions['longConsonant'] = '~';
	longConsonantPosition: PhonationOptions['longConsonantPosition'] = 'before';
	consonantForVowels: PhonationOptions['consonantForVowels'] = 'capital';

	constructor(options: Partial<PhonationOptions> = {}) {
		for (const key in options) {
			this[key] = options[key] ?? this[key];
		}
	}

	/**
	 * @example
	 * albart -> アルバート
	 * milfiiyu -> ミルフィーユ
	 * @param str ascii string
	 * @returns Kana string
	 */
	toKana(str: string) {
		let kana = '';
		let prev = '';
		for (let i = 0; i < str.length; i++) {
			const char = str[i];
			const next = str[i + 1];

			if (/[AIUEO]/.test(char)) {
				kana += toKana[char];
			} else if (isVowel(char)) {
				if (prev && toKana[prev + char]) {
					kana += toKana[prev + char];
				} else if (char === prev) {
					kana += 'ー';
				} else if (prev === '~' && str[i - 2]) {
					kana += toKana[str[i - 2] + char];
				} else if (/[AIUEO]/.test(prev)) {
					kana += toKana[char];
				} else {
					kana += toKana['_' + char];
				}
			} else if (isConsonant(char)) {
				if (!next) {
					kana += toKana[char];
				} else if (char !== 'n' && next === char) {
					kana += 'ッ';
				} else if (
					// 次も子音のとき
					isConsonant(next) ||
					// 次が長音のとき
					next === '-' ||
					// 「子音１(char)、~(next)、子音２(str[i + 2])」の並びのとき
					// デフォルト設定のlongConsonantPosition: 'before'に倣うため
					// ~は子音２とセットになるので子音１をここで出力する
					(next === '~' && str[i + 2] && isConsonant(str[i + 2]))
				) {
					kana += toKana[char];
				}
			} else {
				switch (char) {
					case '-':
						kana += 'ー';
						break;

					case '~':
						if (!next && prev && isConsonant(prev)) {
							kana += 'ッ';
						}
						kana += next ? 'ッ' : toKana[prev];
						break;

					case ' ':
						kana += '・';
						break;
					default:
						break;
				}
			}
			prev = char;
		}
		return kana;
	}

	fromKanaMissings = new Set();
	fromKana(kana: string) {
		let result = '';
		for (let i = 0; i < kana.length; i++) {
			let char = kana[i];
			const next = kana[i + 1];

			if (/[ャュョァィゥェォヮ]/.test(next)) {
				if (fromKana[char + next]) {
					char += next;
					i++;
				} else {
					this.fromKanaMissings.add(char + next);
				}
				// char += next;
				// i++;
			} else if (char === 'ッ') {
				if (this.longConsonant === '~') {
					if (this.longConsonantPosition === 'after') {
						const nexts = fromKana[next];
						result += nexts[0] + '~' + (nexts[1] || '');
						i++;
					} else {
						result += '~';
					}
				} else {
					// this.longConsonant==='repeat'
					char = next;
					result += fromKana[char][0];
				}
				continue;
			} else if (char === 'ー') {
				if (this.longVowel === '-') {
					result += '-';
				} else {
					// this.longVowel==='repeat'
					result += result.slice(-1);
				}
				continue;
			}

			if (/[アイウエオ]/.test(char) && char.length === 1) {
				const res = fromKana[char].toLowerCase();
				switch (this.consonantForVowels) {
					case 'lower':
						result += res;
						continue;

					case '_':
						result += '_' + res;
						continue;
				}
			}

			const current = fromKana[char];

			if (result === current[0]) {
				result += /[td]/.test(result)
					? 'o'
					: /[cTKPGBNM]/.test(result)
					? 'i'
					: 'u';
			}

			if (current) {
				result += current;
			} else {
				console.error(`${kana}: "${char}" is invalid`);
			}
		}
		return result;
	}
}
