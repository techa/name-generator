import { expect, test } from 'vitest';
import { syllable } from './syllable.js';

test(`syllable`, () => {
	expect(syllable('ni-dl')).toStrictEqual(['ni-', 'dl']);
	expect(syllable('unico-n')).toStrictEqual(['u', 'ni', 'co-n']);
	expect(syllable('abeska')).toStrictEqual(['a', 'bes', 'ka']);
	expect(syllable('nidl')).toStrictEqual(['ni', 'dl']);

	expect(syllable('zo-_i')).toStrictEqual(['zo-', '_i']);

	expect(syllable('_u-ta ba-Si-')).toStrictEqual([
		'_u-',
		'ta ',
		'ba-',
		'Si-',
	]);

	expect(syllable('anbli~t')).toStrictEqual(['anb', 'li~t']);
	expect(syllable('an bli~t')).toStrictEqual(['an ', 'bli~t']);

	expect(syllable('de layutel')).toStrictEqual(['de ', 'la', 'yu', 'tel']);

	expect(syllable('AIs')).toStrictEqual(['A', 'Is']);
	expect(syllable('Ais')).toStrictEqual(['A', 'is']);
	expect(syllable('ais')).toStrictEqual(['a', 'is']);
});
