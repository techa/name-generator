import { expect, test } from 'vitest';
import './parseInt.js';
import './parseFloat.js';

test(`parseInt`, () => {
	expect('0.9t'.parseInt()).toBe(0);
	expect('-0.9t'.parseInt()).toBe(-0);
});

test(`parseFloat`, () => {
	expect('0.9t'.parseFloat()).toBe(0.9);
	expect('-0.9t'.parseFloat()).toBe(-0.9);
});
