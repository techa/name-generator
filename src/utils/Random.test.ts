import test from 'ava';
import { Random, word } from './Random.js';

test(`word`, (t) => {
	for (let i = 0; i < 100; i++) {
		t.true(word().length >= 4);
		t.true(word().length <= 6);
		console.log(word());
	}
});

test(`seed number`, (t) => {
	const random1 = new Random(12);
	const random2 = new Random(12);
	t.is(random1.next(), random2.next());
});

test(`seed string`, (t) => {
	const random1 = new Random('hi');
	const random2 = new Random('hi');
	t.is(random1.seed, 'hi');

	t.is(random1.next(), random2.next());
});

test(`1`, (t) => {
	const random = new Random(19650218);
	t.is(random.seed, 19650218);
	t.is(random.nextInt(), 2325592414);
});

test(`1000`, (t) => {
	const random = new Random(19650218);
	for (let i = 0; i < 999; i++) {
		random.nextInt();
	}
	t.is(random.nextInt(), 1746987133);
	// t.is(random.index, 1000);

	// const random2 = new Random(19650218, 1000);
	// t.is(random.nextInt(), random2.nextInt());
});

test(`dice`, (t) => {
	const random = new Random(19650218);
	t.is(random.dice(6), 4);

	let check = true;
	for (let i = 0; i < 1000; i++) {
		const val = random.dice(6, 2);
		check = 2 <= val && val <= 12;
	}
	t.true(check);
});

test(`rpg`, (t) => {
	const random = new Random(19650218);
	t.is(random.rpg('2d100'), 67);

	let check = true;
	for (let i = 0; i < 1000; i++) {
		const val = random.rpg('2d100');
		check = 2 <= val && val <= 200;
	}
	t.true(check);
});
