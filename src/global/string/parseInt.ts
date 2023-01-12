export {};
declare global {
	interface String {
		parseInt(radix?: number): number;
	}
}

String.prototype.parseInt = function _parseInt(this: string, radix = 10) {
	return parseInt(this, radix);
};
