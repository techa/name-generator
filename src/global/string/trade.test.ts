import test from 'ava';
import './trade.js';

test(`String.trade`, (t) => {
	t.is('true'.trade(1), 'true');
	t.is('true'.trade(1, 1), 'tue');
	t.is('true'.trade(1, 1, 'l'), 'tlue');
	t.is('true'.trade(1, 0), 'true');
	t.is('true'.trade(1, 0, 'l'), 'tlrue');
});
