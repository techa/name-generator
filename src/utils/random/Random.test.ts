import { expect, test } from 'vitest';
import { random } from './Random.js';

test(`Random.int`, () => {
	const set = new Set();
	for (let i = 0; i < 100; i++) {
		set.add(random.int(4));
	}

	expect([...set].sort()).toStrictEqual([0, 1, 2, 3, 4]);
});

test(`Random.float`, () => {
	for (let i = 0; i < 100; i++) {
		expect(random.float(4) < 4).toBeTruthy();
		expect(random.float(4) >= 0).toBeTruthy();
	}
});

test(`Random.pick`, () => {
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		expect(arr345.includes(random.pick(arr345))).toBeTruthy();
	}
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		expect(str.includes(random.pick(str))).toBeTruthy();
	}
});

test(`Random.picks`, () => {
	const arr345 = [3, 4, 5];
	for (let i = 0; i < 20; i++) {
		expect(() => random.picks(arr345, 4)).toThrowError();
		expect(() => random.picks(arr345, -4)).toThrowError();
	}

	// allowDuplicates
	const numPicks = 20;
	const picks = random.picks(arr345, numPicks, true);
	expect(picks.length === numPicks).toBeTruthy();
	for (let i = 0; i < numPicks; i++) {
		expect(arr345.includes(picks[i])).toBeTruthy();
	}

	// strings
	const str = 'value';
	for (let i = 0; i < 20; i++) {
		expect(str.includes(random.picks(str, 2)[1])).toBeTruthy();
	}

	// allowDuplicates
	const picksstr = random.picks(str, numPicks, true);
	expect(picks.length === numPicks).toBeTruthy();
	for (let i = 0; i < numPicks; i++) {
		expect(str.includes(picksstr[i])).toBeTruthy();
	}
});

test(`Random.dice`, () => {
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
	).toStrictEqual([12, 11, 10, 9, 8, 7]);
});

test(`Random.rpg`, () => {
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
});

test(`Random.byOdds([3, 4, 5, 1])`, () => {
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
});

test(`Random.byOdds({ a: 3, b: 4, c: 5, d: 1 })`, () => {
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
});

test(`Random.byOdds({ a: {odds:3}, b: {odds:4}, c: {odds:5}, d: {odds:1} })`, () => {
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
});
