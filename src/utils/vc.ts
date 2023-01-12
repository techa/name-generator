import { consonants, vowels } from '../constants/char.js';

export function isVowel(char: string): boolean {
	return vowels.includes(char);
}

export function isConsonant(char: string): boolean {
	return consonants.includes(char);
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
