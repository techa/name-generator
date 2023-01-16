import test from 'ava';
import { Word } from './word.js';
import { MersenneTwister } from './MersenneTwister.js';

test(`Word`, (t) => {
	const word = new Word();
	word.rndm = new MersenneTwister(1);
	t.is(word.next(), 'sbouji');
	console.log([...Array(100)].map(() => word.next()).join('\n'));
});
