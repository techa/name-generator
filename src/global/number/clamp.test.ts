import { expect, test } from 'vitest';
import './clamp.js';

test((`Number.clamp`), () => {
	expect((12).clamp(10)).toBe(10);
	expect((-12).clamp(10)).toBe(0);

	expect((0).clamp(10, 2)).toBe(2);
	expect((0).clamp(2, 10)).toBe(2);
	expect((2).clamp(2, 10)).toBe(2);

	expect((2).clamp(-2, -10)).toBe(-2);
	expect((-16).clamp(-2, -10)).toBe(-10);
});
