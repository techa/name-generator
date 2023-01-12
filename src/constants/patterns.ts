const first = 'first';
const female = 'female';
const male = 'male';
const family = 'family';
const prefix = 'prefix';
const suffix = 'suffix';
const affix = 'affix';
const anywhere = 'anywhere';

export const Tags = {
	first,
	female,
	male,
	family,
	prefix,
	suffix,
	affix,
	anywhere,
};

export interface Pattern {
	pattern: string;
	tags: string[];
}

export const patterns: Pattern[] = [
	{
		//: エル、ケル、ゲル、セル、ゼル、シェル、ジェル、テル、デル、チェル、ヘル、フル、フェル、ヴェル、ベル、ペル、ネル、メル、イェル、レル、リェル
		pattern: '?el',
		tags: [first, affix],
	},
	{
		pattern: '[?-l]el[nmvf]a',
		tags: [first, affix, female],
	},
	{
		pattern: '[?-l]el[nmvf]is',
		tags: [first, affix, male],
	},
	// :[?-l]e(l)[nm]a
	{
		pattern: '?ia',
		tags: [first, suffix, female],
	},

	// :
	{
		pattern: '?agi',
		tags: [prefix],
	},
	{
		pattern: 'lan',
		tags: [first, suffix],
	},
];
