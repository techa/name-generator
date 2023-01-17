/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * compilerOptions."typeRoots": ["./node_modules/@types", "./types"]
 * "include": ["types/*.d.ts"]
 */

// https://github.com/type-challenges/type-challenges

type getLastElm<T> = (
	(T extends T ? (a: (a: T) => void) => void : never) extends (
		a: infer R,
	) => void
		? R
		: never
) extends (a: infer L) => void
	? L
	: never;

// https://bobbyhadz.com/blog/typescript-make-types-global
declare global {
	type UnionToTuple<
		T,
		Tuples extends unknown[] = [],
	> = getLastElm<T> extends never
		? Tuples
		: UnionToTuple<Exclude<T, getLastElm<T>>, [...Tuples, getLastElm<T>]>;

	// https://bigfrontend.dev/ja/typescript/implement-TupleToString-T/discuss
	type TupleToString<T extends unknown[]> = T extends [...infer A, infer B]
		? `${B extends string ? B : never}${TupleToString<
				A extends string[] ? A : never
		  >}`
		: '';

	type UnionToString<T> = TupleToString<UnionToTuple<T>>;
}
export { UnionToTuple, TupleToString, UnionToString };
