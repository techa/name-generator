import test from 'ava';
import './clamp.js';

test(`Number.clamp`, (t) => {
	t.is((12).clamp(10), 10);
	t.is((-12).clamp(10), 0);

	t.is((0).clamp(10, 2), 2);
	t.is((0).clamp(2, 10), 2);
	t.is((2).clamp(2, 10), 2);

	t.is((2).clamp(-2, -10), -2);
	t.is((-16).clamp(-2, -10), -10);
});
