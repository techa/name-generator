import test from 'ava';
import { syllable } from './syllable.js';

test(`syllable`, (t) => {
	t.deepEqual(syllable('ni-dl'), ['ni-', 'dl']);
	t.deepEqual(syllable('unico-n'), ['u', 'ni', 'co-n']);
	t.deepEqual(syllable('abeska'), ['a', 'bes', 'ka']);
	t.deepEqual(syllable('nidl'), ['ni', 'dl']);

	t.deepEqual(syllable('zo-_i'), ['zo-', '_i']);
});
