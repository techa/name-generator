import { expect, test } from 'vitest';
import { Diff, diff } from './Diff.js';

test(`diff('', '')`, () => {
	const diff = new Diff();
	expect(diff.diff('', '')).toStrictEqual([{ count: 0, value: '' }]);
});

test(`diff('restaurant', 'aura')`, () => {
	const diff = new Diff();
	expect(diff.diff('restaurant', 'aura')).toStrictEqual([
		{ count: 4, value: 'rest', added: false, removed: true },
		{ count: 4, value: 'aura' },
		{ count: 2, value: 'nt', added: false, removed: true },
	]);
});

test(`diff('Kaula', 'Gaura')`, () => {
	expect(diff('Kaula', 'Gaura')).toStrictEqual([
		{ count: 1, value: 'K', added: false, removed: true },
		{ count: 1, value: 'G', added: true, removed: false },
		{ count: 2, value: 'au' },
		{ count: 1, value: 'l', added: false, removed: true },
		{ count: 1, value: 'r', added: true, removed: false },
		{ count: 1, value: 'a' },
	]);
});
