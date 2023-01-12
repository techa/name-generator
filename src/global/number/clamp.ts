export {};
declare global {
	interface Number {
		clamp(val1: number, val2?: number): number;
	}
}

function clamp(this: number, val1: number, val2 = 0): number {
	const min = val1 < val2 ? val1 : val2;
	const max = val1 < val2 ? val2 : val1;
	return this > max ? max : this > min ? this : min;
}

Number.prototype.clamp = clamp;
