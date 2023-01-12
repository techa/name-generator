export {};
declare global {
	interface String {
		capitalize(): string;
	}
}

function capitalize(this: string) {
	if (!this || this.length === 0) return '';
	const lower = this.toLowerCase();
	return lower[0].toUpperCase() + lower.substring(1, lower.length);
}

String.prototype.capitalize = capitalize;
