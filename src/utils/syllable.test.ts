import test from 'ava';
import { syllable } from './syllable.js';

test(`syllable`, (t) => {
	t.deepEqual(syllable('ni-dl'), ['ni-', 'dl']);
	t.deepEqual(syllable('unico-n'), ['u', 'ni', 'co-n']);
	t.deepEqual(syllable('abeska'), ['a', 'bes', 'ka']);
	t.deepEqual(syllable('nidl'), ['ni', 'dl']);

	t.deepEqual(syllable('zo-_i'), ['zo-', '_i']);

	t.deepEqual(syllable('_u-ta ba-Si-'), ['_u-', 'ta ', 'ba-', 'Si-']);

	t.deepEqual(syllable('anbli~t'), ['anb', 'li~t']);
	t.deepEqual(syllable('an bli~t'), ['an ', 'bli~t']);

	t.deepEqual(syllable('de layutel'), ['de ', 'la', 'yu', 'tel']);

	t.deepEqual(syllable('AIs'), ['A', 'Is']);
	t.deepEqual(syllable('Ais'), ['A', 'is']);
	t.deepEqual(syllable('ais'), ['a', 'is']);
});
