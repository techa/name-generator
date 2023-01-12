export {};
declare global {
	interface String {
		pascal(): string;
	}
}

String.prototype.pascal = function pascal(this: string) {
	const parts =
		this.replace(/(?<!^)([A-Z])/g, '-$1')
			.split(/[-\s_.]/)
			.map((x) => x.toLowerCase()) ?? [];
	if (parts.length === 0) return '';
	return parts.map((s) => s[0].toUpperCase() + s.slice(1)).join('');
};
