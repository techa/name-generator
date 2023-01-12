export {};
declare global {
	interface String {
		camel(): string;
	}
}

String.prototype.camel = function camel(this: string) {
	const parts =
		this.replace(/(?<!^)([A-Z])/g, '-$1')
			.split(/[.\-\s_]/)
			.map((x) => x.toLowerCase()) ?? [];
	if (parts.length === 0) return '';
	if (parts.length === 1) return parts[0];
	return parts.reduce(
		(acc, part) => `${acc}${part[0].toUpperCase()}${part.slice(1)}`,
	);
};
