/**
 * 母音（vowel）
 */
export type Vowels = 'a' | 'i' | 'u' | 'e' | 'o';
// : UnionToString<Vowels>
export const vowels = 'aiueo' as const;
// export const vowels: Vowels[] = ['a', 'i', 'u', 'e', 'o'];

/**
 * 子音（consonant）
 */
export type Consonants =
	| '_' // 母音を表す子音（Consonant for vowels）
	| 'y'
	| 'w'
	//'
	| 'k'
	| 's'
	| 't'
	| 'p'
	| 'f'
	//"
	| 'g'
	| 'z'
	| 'd'
	| 'b'
	| 'v'
	//
	| 'K' // ky
	| 'c' // ch
	| 'S' // sh| sy
	| 'T' // th
	| 'P' // py
	| 'F' // fy
	//
	| 'G' // gy
	| 'Z' // j| zy
	| 'j' // alias of Z
	| 'D' // dh
	| 'B' // by
	| 'V' // vy
	//
	| 'h'
	| 'H' // hy
	//
	| 'x' // ts
	//
	| 'n'
	| 'N' // ny
	| 'm'
	| 'M' // my
	//
	| 'r'
	| 'l'
	| 'R'; // r

export const consonants = '_ywkstpfgzdbvKcSTPFGZjDBVhHxnNmMrlR' as const;

export type NameExpChars =
	| Vowels
	| Consonants
	| '?' // 任意の子音（Any consonant）
	| '~'; // 繰り返す子音（Repeated consonant）

export const nameExpChars = (vowels +
	consonants +
	'?~') as UnionToString<NameExpChars>;
