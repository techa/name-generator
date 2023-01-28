import test from 'ava';
import { MersenneTwister } from './MersenneTwister.js';

const random = new MersenneTwister(5);

test(`MersenneTwister.int`, (t) => {
	const set = new Set();
	for (let i = 0; i < 100; i++) {
		set.add(random.int(4));
	}

	t.deepEqual([...set].sort(), [0, 1, 2, 3, 4]);

	// MersenneTwister
	t.deepEqual([...set].slice(0, 5), [1, 0, 4, 2, 3]);
});

test(`MersenneTwister.float`, (t) => {
	for (let i = 0; i < 100; i++) {
		t.true(random.float(4) < 4);
		t.true(random.float(4) >= 0);
	}

	// MersenneTwister
	t.is(random.float(4), 3.9460057793185115);
});

test(`MersenneTwister.pick`, (t) => {
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		t.true(arr345.includes(random.pick(arr345)));
	}
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		t.true(str.includes(random.pick(str)));
	}

	// MersenneTwister
	t.is(random.pick(arr345), 3);
});

test(`MersenneTwister.picks`, (t) => {
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		t.throws(() => random.picks(arr345, 4));
		t.throws(() => random.picks(arr345, -4));
		t.throws(() => random.picks(arr345, NaN));
		t.throws(() => random.picks(arr345, Infinity));
	}

	// MersenneTwister
	t.deepEqual(random.picks(arr345, 1.5), [5, 4]);

	// allowDuplicates
	const numPicks = 20;
	const picks = random.picks(arr345, numPicks, true);
	t.true(picks.length === numPicks);
	for (let i = 0; i < numPicks; i++) {
		t.true(arr345.includes(picks[i]));
	}
	// MersenneTwister
	t.deepEqual(random.picks(arr345, 6, true), [3, 3, 3, 4, 5, 3]);

	// strings
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		t.true(str.includes(random.picks(str, 2)[1]));
	}
	// MersenneTwister
	t.deepEqual(random.picks(str, 2), ['a', 'e']);

	// allowDuplicates
	const picksstr = random.picks(str, numPicks, true);
	t.true(picks.length === numPicks);
	for (let i = 0; i < numPicks; i++) {
		t.true(str.includes(picksstr[i]));
	}
	// MersenneTwister
	t.deepEqual(random.picks(str, 5), ['u', 'a', 'e', 'v', 'l']);
});

test(`MersenneTwister.dice`, (t) => {
	const data: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = random.dice(6, 2);
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
		[12, 11, 10, 9, 7, 8],
	);

	// MersenneTwister
	t.deepEqual(random.dice(6, 2), 8);
});

test(`MersenneTwister.rpg`, (t) => {
	const data: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = random.rpg('3d6');
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

	// MersenneTwister
	t.deepEqual(random.rpg('3d6'), 12);
});

test(`MersenneTwister.byOdds([3, 4, 5, 1])`, (t) => {
	const map: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = random.byOdds([3, 4, 5, 1]);

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

	// MersenneTwister
	t.deepEqual(random.byOdds([3, 4, 5, 1]), 2);
});

test(`MersenneTwister.byOdds({ a: 3, b: 4, c: 5, d: 1 })`, (t) => {
	const data: Record<string, number> = { a: 3, b: 4, c: 5, d: 1 };
	const map: Map<string, number> = new Map();

	for (let i = 0; i < 1000; i++) {
		const key = random.byOdds(data);

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

	// MersenneTwister
	t.deepEqual(random.byOdds(data), 'a');
});

test(`MersenneTwister.byOdds({ a: {odds:3}, b: {odds:4}, c: {odds:5}, d: {odds:1} })`, (t) => {
	type Value = { odds: number };
	const data: Record<string, Value> = {
		a: { odds: 3 },
		b: { odds: 4 },
		c: { odds: 5 },
		d: { odds: 1 },
	};
	const map: Map<string, number> = new Map();

	for (let i = 0; i < 1000; i++) {
		const [key] = random.byOdds(data);
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

	// MersenneTwister
	t.deepEqual(random.byOdds(data), ['c', { odds: 5 }]);
});

test(`MersenneTwister.byOdds({ a: {key:3}, b: {key:4}, c: {key:5}, d: {key:1} })`, (t) => {
	type Value = { key: number };
	const data: Record<string, Value> = {
		a: { key: 3 },
		b: { key: 4 },
		c: { key: 5 },
		d: { key: 1 },
	};
	const map: Map<string, number> = new Map();

	for (let i = 0; i < 1000; i++) {
		const [key] = random.byOdds(data, 'key');
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

	// MersenneTwister
	t.deepEqual(random.byOdds(data, 'key'), ['d', { key: 1 }]);
});
