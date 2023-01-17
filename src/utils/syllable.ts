import { isVowel, transVC } from './vc.js';

/**
 *  Word split into syllables
 */
export function syllable(word: string): string[] {
	const syllables = [];
	let lastVowelIndex = -1;
	let current = '';
	for (let i = 0; i < word.length; i++) {
		const char = word[i];

		current += char;

		if (char === ' ') {
			syllables.push(current);
			current = '';
			lastVowelIndex = -1;
			continue;
		}

		if (isVowel(char, '-AIUEO')) {
			if (lastVowelIndex >= 0) {
				const len = current.length;
				if (i - lastVowelIndex === 1) {
					const end = char === '-' ? len : len - 1;
					syllables.push(current.substring(0, end));
					current = current.substring(end, len);
				} else {
					const val = current.substring(0, len - 2);
					if (val) {
						syllables.push(val);
					}
					current = current.substring(len - 2, len);
				}
			}
			lastVowelIndex = i;
		}
	}
	if (current.length > 0) {
		const vc = transVC(current);
		if (vc === 'C') {
			syllables[syllables.length - 1] += current;
		} else if (/.CC$/.test(vc)) {
			const len = current.length;
			syllables.push(current.substring(0, len - 2));
			syllables.push(current.substring(len - 2, len));
		} else {
			syllables.push(current.trim());
		}
	}
	return syllables;
}
