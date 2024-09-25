/* eslint-disable no-sparse-arrays */
import { expect, test } from 'vitest';
import { Array2d } from './Array2d.js';

test(`Array2d(1, 2)`, () => {
	const arr = new Array2d(1, 2);
	expect(arr.columns).toBe(1);
	expect(arr.rows).toBe(2);
	expect(arr.length).toBe(2);
	expect(arr.values).toStrictEqual([]);
	expect(arr.get2d()).toStrictEqual([[], []]);
});

test(`Array2d(3, 4)`, () => {
	const arr = new Array2d(3, 4);
	expect(arr.columns).toBe(3);
	expect(arr.rows).toBe(4);
	expect(arr.length).toBe(12);
	arr.setValue({ x: 1, y: 1 }, 0);
	expect(arr.values).toStrictEqual([, , , , 0]);
	expect(arr.get2d()).toStrictEqual([[, , ,], [, 0], [], []]);

	arr.each((_, { i }) => i);
	expect(arr.values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
	arr.setValue({ x: 1, y: 1 }, 0);
	expect(arr.get2d()).toStrictEqual([
		[0, 1, 2],
		[3, 0, 5],
		[6, 7, 8],
		[9, 10, 11],
	]);
});

test(`Array2d(3, 4).each`, () => {
	const arr = new Array2d<number>(3, 4);

	arr.each((_, { i }) => i).each((arg) => arg * 2);
	expect(arr.values).toStrictEqual([
		0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
	]);
});

test(`Array2d(3, 4).map`, () => {
	const arr1 = new Array2d<number>(3, 4).each((_, { i }) => i);
	const arr2 = arr1.map((arg) => arg * 2);
	expect(arr1.values).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
	expect(arr2.values).toStrictEqual([
		0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
	]);
});

// test((`Array2d(3, 4).{unshiftRows,shiftRows}`), () => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.unshiftRows();
// 	expect(arr.get2d()).toStrictEqual([
// 		[undefined, undefined, undefined],
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	expect(arr.columns).toBe(3);
// 	expect(arr.rows).toBe(5);
// 	expect(arr.length).toBe(15);

// 	arr.shiftRows();
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);
// });

// test((`Array2d(3, 4).{pushRows,popRows}`), () => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.pushRows();
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 		[undefined, undefined, undefined],
// 	]);

// 	arr.popRows();
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);
// });

// test((`Array2d(3, 4).{unshiftColumns,shiftColumns}`), () => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.shiftColumns();
// 	expect(arr.get2d()).toStrictEqual([
// 		[1, 2],
// 		[4, 5],
// 		[7, 8],
// 		[10, 11],
// 	]);

// 	arr.unshiftColumns();
// 	expect(arr.get2d()).toStrictEqual([
// 		[undefined, 1, 2],
// 		[undefined, 4, 5],
// 		[undefined, 7, 8],
// 		[undefined, 10, 11],
// 	]);
// });

// test((`Array2d(3, 4).{pushColumns,popColumns}`), () => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.pushColumns();
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2, undefined],
// 		[3, 4, 5, undefined],
// 		[6, 7, 8, undefined],
// 		[9, 10, 11, undefined],
// 	]);

// 	arr.popColumns();
// 	expect(arr.get2d()).toStrictEqual([
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);
// });

test(`Array2d().addColumns`, () => {
	const arr = new Array2d<number>(2, 2, -1).each((_, { i }) => i);
	expect(arr.get2d()).toStrictEqual([
		[0, 1],
		[2, 3],
	]);

	arr.addColumns(0);
	expect(arr.values).toStrictEqual(
		[
			[-1, 0, 1],
			[-1, 2, 3],
		].flat(),
	);
});

test(`Array2d(3, 4).{addColumns,removeColumns}`, () => {
	const arr = new Array2d<number>(3, 4, -1).each((_, { i }) => i);
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);

	arr.addColumns();
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2, -1],
			[3, 4, 5, -1],
			[6, 7, 8, -1],
			[9, 10, 11, -1],
		].flat(),
	);

	arr.addColumns(1);
	expect(arr.values).toStrictEqual(
		[
			[0, -1, 1, 2, -1],
			[3, -1, 4, 5, -1],
			[6, -1, 7, 8, -1],
			[9, -1, 10, 11, -1],
		].flat(),
	);

	arr.removeColumns(1);
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2, -1],
			[3, 4, 5, -1],
			[6, 7, 8, -1],
			[9, 10, 11, -1],
		].flat(),
	);

	arr.removeColumns();
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);
});

test(`Array2d(3, 4).{addRows,removeRows}`, () => {
	const arr = new Array2d<number>(3, 4, -1).each((_, { i }) => i);
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);

	arr.addRows();
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
			[-1, -1, -1],
		].flat(),
	);

	arr.addRows(0);
	expect(arr.values).toStrictEqual(
		[
			[-1, -1, -1],
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
			[-1, -1, -1],
		].flat(),
	);

	arr.removeRows();
	expect(arr.values).toStrictEqual(
		[
			[-1, -1, -1],
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);

	arr.removeRows(0);
	expect(arr.values).toStrictEqual(
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);
});

test(`Array2d(3, 4).spiral`, () => {
	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
	expect(arr.get2d()).toStrictEqual([
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[9, 10, 11],
	]);
	const spiral = [];

	arr.spiral((v) => {
		spiral.push(v);
	});
	expect(spiral).toStrictEqual([4, 5, 8, 7, 6, 3, 0, 1, 2, 11, 10, 9]);
});

test(`Array2d(5, 6).near`, () => {
	const arr = new Array2d<number>(5, 6).each((_, { i }) => i);
	// prettier-ignore
	expect(arr.get2d()).toStrictEqual([
		[0, 1, 2, 3, 4],
		[5, 6, 7, 8, 9],
		[10, 11, 12, 13, 14],
		[15, 16, 17, 18, 19],
		[20, 21, 22, 23, 24],
		[25, 26, 27, 28, 29],
	]);
	const near = [];

	arr.near((v) => {
		near.push(v);
	});

	expect(near).toStrictEqual([
		12, 7, 11, 13, 17, 6, 8, 16, 18, 2, 10, 14, 22, 1, 3, 5, 9, 15, 19, 21,
		23, 0, 4, 20, 24, 27, 26, 28, 25, 29,
	]);
});

test(`Array2d(10, 8).near`, () => {
	const arr = new Array2d<number>(10, 8).each((_, { i }) => i);
	// prettier-ignore
	expect(arr.get2d()).toStrictEqual([
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		[10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
		[20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
		[30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
		[40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
		[50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
		[60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
		[70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
	]);
	const near = [];

	arr.near((v) => {
		near.push(v);
	}, 0);

	expect(near).toStrictEqual([
		0, 1, 10, 11, 2, 20, 12, 21, 22, 3, 30, 13, 31, 23, 32, 4, 40, 14, 41,
		33, 24, 42, 34, 43, 5, 50, 15, 51, 25, 52, 44, 35, 53, 6, 60, 16, 61,
		26, 62, 45, 54, 36, 63, 7, 70, 55, 17, 71, 46, 64, 27, 72, 37, 73, 56,
		65, 8, 47, 74, 18, 28, 66, 38, 57, 75, 48, 9, 19, 67, 76, 29, 58, 39,
		49, 77, 68, 59, 78, 69, 79,
	]);
});

test(`Array2d().fillPaint`, () => {
	const arr = new Array2d([
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 2, 2, 0, 0],
		[0, 0, 1, 0, 0, 2, 0, 0],
		[0, 0, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]);

	expect(arr.fillPaint({ x: 2, y: 2 }, () => 5).get2d()).toStrictEqual([
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 5, 0, 2, 2, 0, 0],
		[0, 0, 5, 0, 0, 2, 0, 0],
		[0, 0, 5, 5, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]);
	expect(arr.fillPaint({ x: 5, y: 3 }, () => 5).get2d()).toStrictEqual([
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 5, 0, 5, 5, 0, 0],
		[0, 0, 5, 0, 0, 5, 0, 0],
		[0, 0, 5, 5, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]);
});
