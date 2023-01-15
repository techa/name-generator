import { consonants, vowels } from '../constants/char.js';

/**
 * `isVowel(char) && char==='-'`
 *  ↓
 * `isVowel(char, '-')`
 */
export function isVowel(char: string, ex = ''): boolean {
	return (vowels + ex).includes(char);
}

export function isConsonant(char: string, ex = ''): boolean {
	return (consonants + ex).includes(char);
}

/**
 * - end -> VCC
 * - chara -> CCVCV
 * - unico-n -> VCVCV-C
 */
export function transVC(word: string): string {
	let vc = '';
	for (const char of word) {
		vc += isConsonant(char) ? 'C' : isVowel(char) ? 'V' : char;
	}
	return vc;
}
