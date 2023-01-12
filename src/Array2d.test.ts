import test from 'ava';
import { Array2d } from './Array2d.js';

test(`Array2d(1, 2)`, (t) => {
	const arr = new Array2d(1, 2);
	t.is(arr.columns, 1);
	t.is(arr.rows, 2);
	t.is(arr.length, 2);
	t.deepEqual(arr.values, []);
	t.deepEqual(arr.get2d(), [[], []]);
});

test(`Array2d(3, 4)`, (t) => {
	const arr = new Array2d(3, 4);
	t.is(arr.columns, 3);
	t.is(arr.rows, 4);
	t.is(arr.length, 12);
	arr.setValue({ x: 1, y: 1 }, 0);
	t.deepEqual(arr.values, [undefined, undefined, undefined, undefined, 0]);
	t.deepEqual(arr.get2d(), [
		[undefined, undefined, undefined],
		[undefined, 0],
		[],
		[],
	]);

	arr.each((_, { i }) => i);
	t.deepEqual(arr.values, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
	arr.setValue({ x: 1, y: 1 }, 0);
	t.deepEqual(arr.get2d(), [
		[0, 1, 2],
		[3, 0, 5],
		[6, 7, 8],
		[9, 10, 11],
	]);
});

test(`Array2d(3, 4).each`, (t) => {
	const arr = new Array2d<number>(3, 4);

	arr.each((_, { i }) => i).each((arg) => arg * 2);
	t.deepEqual(arr.values, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);
});

test(`Array2d(3, 4).map`, (t) => {
	const arr1 = new Array2d<number>(3, 4).each((_, { i }) => i);
	const arr2 = arr1.map((arg) => arg * 2);
	t.deepEqual(arr1.values, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
	t.deepEqual(arr2.values, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);
});

// test(`Array2d(3, 4).{unshiftRows,shiftRows}`, (t) => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.unshiftRows();
// 	t.deepEqual(arr.get2d(), [
// 		[undefined, undefined, undefined],
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	t.is(arr.columns, 3);
// 	t.is(arr.rows, 5);
// 	t.is(arr.length, 15);

// 	arr.shiftRows();
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);
// });

// test(`Array2d(3, 4).{pushRows,popRows}`, (t) => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.pushRows();
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 		[undefined, undefined, undefined],
// 	]);

// 	arr.popRows();
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);
// });

// test(`Array2d(3, 4).{unshiftColumns,shiftColumns}`, (t) => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.shiftColumns();
// 	t.deepEqual(arr.get2d(), [
// 		[1, 2],
// 		[4, 5],
// 		[7, 8],
// 		[10, 11],
// 	]);

// 	arr.unshiftColumns();
// 	t.deepEqual(arr.get2d(), [
// 		[undefined, 1, 2],
// 		[undefined, 4, 5],
// 		[undefined, 7, 8],
// 		[undefined, 10, 11],
// 	]);
// });

// test(`Array2d(3, 4).{pushColumns,popColumns}`, (t) => {
// 	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);

// 	arr.pushColumns();
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2, undefined],
// 		[3, 4, 5, undefined],
// 		[6, 7, 8, undefined],
// 		[9, 10, 11, undefined],
// 	]);

// 	arr.popColumns();
// 	t.deepEqual(arr.get2d(), [
// 		[0, 1, 2],
// 		[3, 4, 5],
// 		[6, 7, 8],
// 		[9, 10, 11],
// 	]);
// });

test(`Array2d().addColumns`, (t) => {
	const arr = new Array2d<number>(2, 2, -1).each((_, { i }) => i);
	t.deepEqual(arr.get2d(), [
		[0, 1],
		[2, 3],
	]);

	arr.addColumns(0);
	t.deepEqual(
		arr.values,
		[
			[-1, 0, 1],
			[-1, 2, 3],
		].flat(),
	);
});

test(`Array2d(3, 4).{addColumns,removeColumns}`, (t) => {
	const arr = new Array2d<number>(3, 4, -1).each((_, { i }) => i);
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);

	arr.addColumns();
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2, -1],
			[3, 4, 5, -1],
			[6, 7, 8, -1],
			[9, 10, 11, -1],
		].flat(),
	);

	arr.addColumns(1);
	t.deepEqual(
		arr.values,
		[
			[0, -1, 1, 2, -1],
			[3, -1, 4, 5, -1],
			[6, -1, 7, 8, -1],
			[9, -1, 10, 11, -1],
		].flat(),
	);

	arr.removeColumns(1);
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2, -1],
			[3, 4, 5, -1],
			[6, 7, 8, -1],
			[9, 10, 11, -1],
		].flat(),
	);

	arr.removeColumns();
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);
});

test(`Array2d(3, 4).{addRows,removeRows}`, (t) => {
	const arr = new Array2d<number>(3, 4, -1).each((_, { i }) => i);
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);

	arr.addRows();
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
			[-1, -1, -1],
		].flat(),
	);

	arr.addRows(0);
	t.deepEqual(
		arr.values,
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
	t.deepEqual(
		arr.values,
		[
			[-1, -1, -1],
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);

	arr.removeRows(0);
	t.deepEqual(
		arr.values,
		[
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[9, 10, 11],
		].flat(),
	);
});

test(`Array2d(3, 4).spiral`, (t) => {
	const arr = new Array2d<number>(3, 4).each((_, { i }) => i);
	t.deepEqual(arr.get2d(), [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[9, 10, 11],
	]);
	const spiral = [];

	arr.spiral((v) => {
		spiral.push(v);
	});
	t.deepEqual(spiral, [4, 5, 8, 7, 6, 3, 0, 1, 2, 11, 10, 9]);
});

test(`Array2d(5, 6).near`, (t) => {
	const arr = new Array2d<number>(5, 6).each((_, { i }) => i);
	// prettier-ignore
	t.deepEqual(arr.get2d(), [
		[ 0,  1,  2,  3,  4],
		[ 5,  6,  7,  8,  9],
		[10, 11, 12, 13, 14],
		[15, 16, 17, 18, 19],
		[20, 21, 22, 23, 24],
		[25, 26, 27, 28, 29],
	]);
	const near = [];

	arr.near((v) => {
		near.push(v);
	});

	t.deepEqual(
		near,
		[
			12, 7, 11, 13, 17, 6, 8, 16, 18, 2, 10, 14, 22, 1, 3, 5, 9, 15, 19,
			21, 23, 0, 4, 20, 24, 27, 26, 28, 25, 29,
		],
	);
});

test(`Array2d(10, 8).near`, (t) => {
	const arr = new Array2d<number>(10, 8).each((_, { i }) => i);
	// prettier-ignore
	t.deepEqual(arr.get2d(), [
		[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9],
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

	t.deepEqual(
		near,
		[
			0, 1, 10, 11, 2, 20, 12, 21, 22, 3, 30, 13, 31, 23, 32, 4, 40, 14,
			41, 33, 24, 42, 34, 43, 5, 50, 15, 51, 25, 52, 44, 35, 53, 6, 60,
			16, 61, 26, 62, 45, 54, 36, 63, 7, 70, 55, 17, 71, 46, 64, 27, 72,
			37, 73, 56, 65, 8, 47, 74, 18, 28, 66, 38, 57, 75, 48, 9, 19, 67,
			76, 29, 58, 39, 49, 77, 68, 59, 78, 69, 79,
		],
	);
});

test(`Array2d().fillPaint`, (t) => {
	const arr = new Array2d([
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 2, 2, 0, 0],
		[0, 0, 1, 0, 0, 2, 0, 0],
		[0, 0, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]);

	t.deepEqual(arr.fillPaint({ x: 2, y: 2 }, () => 5).get2d(), [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 5, 0, 2, 2, 0, 0],
		[0, 0, 5, 0, 0, 2, 0, 0],
		[0, 0, 5, 5, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]);
	t.deepEqual(arr.fillPaint({ x: 5, y: 3 }, () => 5).get2d(), [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 5, 0, 5, 5, 0, 0],
		[0, 0, 5, 0, 0, 5, 0, 0],
		[0, 0, 5, 5, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]);
});
