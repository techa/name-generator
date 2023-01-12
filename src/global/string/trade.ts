declare global {
	interface String {
		trade(start: number, deleteCount: number, ...items: string[]): string;
		trade(start: number, deleteCount: number): string;
		trade(start: number): string;
	}
}

/**
 * Edit the same way as Array.splice
 *
 * @memberof JsExtensions
 * @param {number} start - ...args
 * @param {number} deleteCount - ...args
 * @param {string[]} items - ...args
 * @returns {string}
 */
function trade(
	this: string,
	start: number,
	deleteCount: number,
	...items: string[]
): string;
function trade(this: string, start: number, deleteCount: number): string;
function trade(this: string, start: number): string;
function trade(
	this: string,
	start: number,
	deleteCount?: number,
	...items: string[]
): string {
	if (!deleteCount && items.length === 0) {
		return this;
	}
	return (
		this.slice(0, start) + items.join('') + this.slice(start + deleteCount)
	);
}
String.prototype.trade = trade;

export {};
