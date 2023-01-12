import test from 'ava';
import { Diff, diff } from './Diff.js';

test(`diff('', '')`, (t) => {
	const diff = new Diff();
	t.deepEqual(diff.diff('', ''), [{ count: 0, value: '' }]);
});

test(`diff('restaurant', 'aura')`, (t) => {
	const diff = new Diff();
	t.deepEqual(diff.diff('restaurant', 'aura'), [
		{ count: 4, value: 'rest', added: false, removed: true },
		{ count: 4, value: 'aura' },
		{ count: 2, value: 'nt', added: false, removed: true },
	]);
});

test(`diff('Kaula', 'Gaura')`, (t) => {
	t.deepEqual(diff('Kaula', 'Gaura'), [
		{ count: 1, value: 'K', added: false, removed: true },
		{ count: 1, value: 'G', added: true, removed: false },
		{ count: 2, value: 'au' },
		{ count: 1, value: 'l', added: false, removed: true },
		{ count: 1, value: 'r', added: true, removed: false },
		{ count: 1, value: 'a' },
	]);
});
