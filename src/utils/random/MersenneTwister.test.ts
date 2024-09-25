// https://vitest.dev/api/expect.html
// https://jestjs.io/docs/expect
import { expect, test } from 'vitest';
import { MersenneTwister } from './MersenneTwister.js';

const random = new MersenneTwister(5);

test(`MersenneTwister.int`, () => {
	const set = new Set();
	for (let i = 0; i < 100; i++) {
		set.add(random.int(4));
	}

	expect([...set].sort()).toStrictEqual([0, 1, 2, 3, 4]);

	// MersenneTwister
	expect([...set].slice(0, 5)).toStrictEqual([1, 0, 4, 2, 3]);
});

test(`MersenneTwister.float`, () => {
	for (let i = 0; i < 100; i++) {
		expect(random.float(4) < 4).toBeTruthy();
		expect(random.float(4) >= 0).toBeTruthy();
	}

	// MersenneTwister
	expect(random.float(4)).toBe(3.9460057793185115);
});

test(`MersenneTwister.pick`, () => {
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		expect(arr345.includes(random.pick(arr345))).toBeTruthy();
	}
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		expect(str.includes(random.pick(str))).toBeTruthy();
	}

	// MersenneTwister
	expect(random.pick(arr345)).toBe(3);
});

test(`MersenneTwister.picks`, () => {
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		expect(() => random.picks(arr345, 4)).toThrowError();
		expect(() => random.picks(arr345, -4)).toThrowError();
		expect(() => random.picks(arr345, NaN)).toThrowError();
		expect(() => random.picks(arr345, Infinity)).toThrowError();
	}

	// MersenneTwister
	expect(random.picks(arr345, 1.5)).toStrictEqual([5, 4]);

	// allowDuplicates
	const numPicks = 20;
	const picks = random.picks(arr345, numPicks, true);
	expect(picks.length === numPicks).toBeTruthy();
	for (let i = 0; i < numPicks; i++) {
		expect(arr345.includes(picks[i])).toBeTruthy();
	}
	// MersenneTwister
	expect(random.picks(arr345, 6, true)).toStrictEqual([3, 3, 3, 4, 5, 3]);

	// strings
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		expect(str.includes(random.picks(str, 2)[1])).toBeTruthy();
	}
	// MersenneTwister
	expect(random.picks(str, 2)).toStrictEqual(['a', 'e']);

	// allowDuplicates
	const picksstr = random.picks(str, numPicks, true);
	expect(picks.length === numPicks).toBeTruthy();
	for (let i = 0; i < numPicks; i++) {
		expect(str.includes(picksstr[i])).toBeTruthy();
	}
	// MersenneTwister
	expect(random.picks(str, 5)).toStrictEqual(['u', 'a', 'e', 'v', 'l']);
});

test(`MersenneTwister.dice`, () => {
	const data: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = random.dice(6, 2);
		data[keynum] ||= 0;
		data[keynum]++;
	}

	const arr = Object.entries(data).sort((a, b) => +a[0] - +b[0]);
	const firsthalf = arr.slice(0, Math.ceil(arr.length / 2));
	const lasthalf = arr.slice(arr.length / 2);

	expect(
		firsthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
	).toStrictEqual([2, 3, 4, 5, 6, 7]);

	expect(
		lasthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
	).toStrictEqual([12, 11, 10, 9, 7, 8]);

	// MersenneTwister
	expect(random.dice(6, 2)).toStrictEqual(8);
});

test(`MersenneTwister.rpg`, () => {
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

	expect(
		firsthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
	).toStrictEqual([3, 4, 5, 6, 7]);

	expect(
		lasthalf.sort((a, b) => a[1] - b[1]).map((v) => +v[0]),
	).toStrictEqual([18, 17, 16, 15, 14]);

	// MersenneTwister
	expect(random.rpg('3d6')).toStrictEqual(12);
});

test(`MersenneTwister.byOdds([3, 4, 5, 1])`, () => {
	const map: Record<string, number> = {};
	for (let i = 0; i < 1000; i++) {
		const keynum = random.byOdds([3, 4, 5, 1]);

		expect(typeof keynum === 'number').toBeTruthy();

		map[keynum] ||= 0;
		map[keynum]++;
	}

	expect(
		Object.entries(map)
			.sort((a, b) => +a[0] - +b[0])
			.sort((a, b) => a[1] - b[1])
			.map((v) => +v[0]),
	).toStrictEqual([3, 0, 1, 2]);

	// MersenneTwister
	expect(random.byOdds([3, 4, 5, 1])).toStrictEqual(2);
});

test(`MersenneTwister.byOdds({ a: 3, b: 4, c: 5, d: 1 })`, () => {
	const data: Record<string, number> = { a: 3, b: 4, c: 5, d: 1 };
	const map: Map<string, number> = new Map();

	for (let i = 0; i < 1000; i++) {
		const key = random.byOdds(data);

		expect(typeof key === 'string').toBeTruthy();

		const val = map.get(key);
		if (val != null) {
			map.set(key, val + 1);
		} else {
			map.set(key, 1);
		}
	}

	expect(
		[...map.entries()].sort((a, b) => a[1] - b[1]).map((v) => v[0]),
	).toStrictEqual(['d', 'a', 'b', 'c']);

	// MersenneTwister

	expect(random.byOdds(data)).toStrictEqual('a');
});

test(`MersenneTwister.byOdds({ a: {odds:3}, b: {odds:4}, c: {odds:5}, d: {odds:1} })`, () => {
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

	expect(
		[...map.entries()].sort((a, b) => a[1] - b[1]).map((v) => v[0]),
	).toStrictEqual(['d', 'a', 'b', 'c']);

	// MersenneTwister
	expect(random.byOdds(data)).toStrictEqual(['c', { odds: 5 }]);
});

test(`MersenneTwister.byOdds({ a: {key:3}, b: {key:4}, c: {key:5}, d: {key:1} })`, () => {
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

	expect(
		[...map.entries()].sort((a, b) => a[1] - b[1]).map((v) => v[0]),
	).toStrictEqual(['d', 'a', 'b', 'c']);

	// MersenneTwister
	expect(random.byOdds(data, 'key')).toStrictEqual(['d', { key: 1 }]);
});
