import { expect, test } from 'vitest';
import { Random, word } from './Random.js';

test((`word`), () => {
	for (let i = 0; i < 100; i++) {
		expect(word().length >= 4).toBeTruthy();
		expect(word().length <= 6).toBeTruthy();
		console.log(word());
	}
});

test((`seed number`), () => {
	const random1 = new Random(12);
	const random2 = new Random(12);
	expect(random1.next()).toBe(random2.next());
});

test((`seed string`), () => {
	const random1 = new Random('hi');
	const random2 = new Random('hi');
	expect(random1.seed).toBe('hi');

	expect(random1.next()).toBe(random2.next());
});

test((`1`), () => {
	const random = new Random(19650218);
	expect(random.seed).toBe(19650218);
	expect(random.nextInt()).toBe(2325592414);
});

test((`1000`), () => {
	const random = new Random(19650218);
	for (let i = 0; i < 999; i++) {
		random.nextInt();
	}
	expect(random.nextInt()).toBe(1746987133);
	// expect(random.index).toBe(1000);

	// const random2 = new Random(19650218, 1000);
	// expect(random.nextInt()).toBe(random2.nextInt());
});

test((`dice`), () => {
	const random = new Random(19650218);
	expect(random.dice(6)).toBe(4);

	let check = true;
	for (let i = 0; i < 1000; i++) {
		const val = random.dice(6, 2);
		check = 2 <= val && val <= 12;
	}
	expect(check).toBeTruthy();
});

test((`rpg`), () => {
	const random = new Random(19650218);
	expect(random.rpg('2d100')).toBe(67);

	let check = true;
	for (let i = 0; i < 1000; i++) {
		const val = random.rpg('2d100');
		check = 2 <= val && val <= 200;
	}
	expect(check).toBeTruthy();
});
