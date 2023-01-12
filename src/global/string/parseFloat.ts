export {};
declare global {
	interface String {
		parseFloat(): number;
	}
}

String.prototype.parseFloat = function _parseFloat(this: string) {
	return parseFloat(this);
};
