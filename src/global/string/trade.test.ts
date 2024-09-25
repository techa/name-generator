import { expect, test } from 'vitest';
import './trade.js';

test(`String.trade`, () => {
	expect('true'.trade(1)).toBe('true');
	expect('true'.trade(1, 1)).toBe('tue');
	expect('true'.trade(1, 1, 'l')).toBe('tlue');
	expect('true'.trade(1, 0)).toBe('true');
	expect('true'.trade(1, 0, 'l')).toBe('tlrue');
});
