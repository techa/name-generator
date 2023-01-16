import test from 'ava';
import { Random } from './Random.js';

test(`Random.int`, (t) => {
	const rndm = new Random();
	const set = new Set();
	for (let i = 0; i < 1000; i++) {
		set.add(rndm.int(4));
	}

	t.deepEqual([...set].sort(), [0, 1, 2, 3, 4]);
});

test(`Random.float`, (t) => {
	const rndm = new Random();
	for (let i = 0; i < 1000; i++) {
		t.true(rndm.float(4) < 4);
		t.true(rndm.float(4) >= 0);
	}
});

test(`Random.pick`, (t) => {
	const rndm = new Random();
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		t.true(arr345.includes(rndm.pick(arr345)));
	}
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		t.true(str.includes(rndm.pick(str)));
	}
});

test(`Random.picks`, (t) => {
	const rndm = new Random();
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		t.throws(() => rndm.picks(arr345, 4));
		t.throws(() => rndm.picks(arr345, -4));
	}
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		t.true(str.includes(rndm.picks(str, 2)[1]));
	}
});

test(`Random.dice`, (t) => {
	const rndm = new Random();
	const data: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = rndm.dice(6, 2);
		data[keynum] ||= 0;
		data[keynum]++;
	}

	const arr = Object.entries(data).sort((a, b) => +a[0] - +b[0]);
	const firsthalf = arr.slice(0, Math.ceil(arr.length / 2));
	const lasthalf = arr.slice(arr.length / 2);

	t.deepEqual(
		firsthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
		[2, 3, 4, 5, 6, 7],
	);

	t.deepEqual(
		lasthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
		[12, 11, 10, 9, 8, 7],
	);
});

test(`Random.rpg`, (t) => {
	const rndm = new Random();
	const data: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = rndm.rpg('3d6');
		data[keynum] ||= 0;
		data[keynum]++;
	}

	const arr = Object.entries(data).sort((a, b) => +a[0] - +b[0]);
	const n = 5;
	const firsthalf = arr.slice(0, n);
	const lasthalf = arr.slice(arr.length - n);

	t.deepEqual(
		firsthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
		[3, 4, 5, 6, 7],
	);

	t.deepEqual(
		lasthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
		[18, 17, 16, 15, 14],
	);
});

test(`Random.byOdds([3, 4, 5, 1])`, (t) => {
	const rndm = new Random();
	const map: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = rndm.byOdds([3, 4, 5, 1]);

		t.true(typeof keynum === 'number');

		map[keynum] ||= 0;
		map[keynum]++;
	}

	t.deepEqual(
		Object.entries(map)
			.sort((a, b) => +a[0] - +b[0])
			.sort((a, b) => a[1] - b[1])
			.map((v) => +v[0]),
		[3, 0, 1, 2],
	);
});

test(`Random.byOdds({ a: 3, b: 4, c: 5, d: 1 })`, (t) => {
	const rndm = new Random();
	const data: Record<string, number> = { a: 3, b: 4, c: 5, d: 1 };
	const map: Map<string, number> = new Map();

	for (let i = 0; i < 1000; i++) {
		const key = rndm.byOdds(data);

		t.true(typeof key === 'string');

		const val = map.get(key);
		if (val != null) {
			map.set(key, val + 1);
		} else {
			map.set(key, 1);
		}
	}

	t.deepEqual(
		[...map.entries()].sort((a, b) => a[1] - b[1]).map((v) => v[0]),
		['d', 'a', 'b', 'c'],
	);
});

test(`Random.byOdds({ a: {odds:3}, b: {odds:4}, c: {odds:5}, d: {odds:1} })`, (t) => {
	const rndm = new Random();
	type Value = { odds: number };
	const data: Record<string, Value> = {
		a: { odds: 3 },
		b: { odds: 4 },
		c: { odds: 5 },
		d: { odds: 1 },
	};
	const map: Map<string, number> = new Map();

	for (let i = 0; i < 1000; i++) {
		const [key] = rndm.byOdds(data);
		const val = map.get(key);
		if (val != null) {
			map.set(key, val + 1);
		} else {
			map.set(key, 1);
		}
	}

	t.deepEqual(
		[...map.entries()].sort((a, b) => a[1] - b[1]).map((v) => v[0]),
		['d', 'a', 'b', 'c'],
	);
});
