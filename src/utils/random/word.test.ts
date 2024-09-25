import { expect, test } from 'vitest';
import { Word } from './word.js';
import { MersenneTwister } from './MersenneTwister.js';

test(`Word`, () => {
	const word = new Word();
	word.rndm = new MersenneTwister(1);
	expect(word.next()).toBe('sbouji');
	console.log([...Array(100)].map(() => word.next()).join('\n'));
});
