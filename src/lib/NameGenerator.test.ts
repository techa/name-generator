import { expect, test } from 'vitest';
import { NameGenerator } from './NameGenerator.js';
import { MersenneTwister } from '../utils/random/MersenneTwister.js';

import { readFile, writeFile } from 'fs/promises';
const en = (await readFile('./resource/exp/female-en.txt', 'utf-8')).split(
	'\n',
);
const kana_en = (
	await readFile('./resource/kana/female-en.txt', 'utf-8')
).split('\n');
const fr = (await readFile('./resource/exp/female-fr.txt', 'utf-8')).split(
	'\n',
);

test(`NameGenerator en`, () => {
	const ng = new NameGenerator();
	ng.add(en);

	let s = 0;
	function random() {
		return new MersenneTwister(++s);
	}
	expect(ng.create({ random: random() })).toStrictEqual({
		exp: 'zad-li-n',
		kana: 'ザドーリーン',
		syllables: 3,
		exist: false,
	});

	expect(ng.create({ random: random() })).toStrictEqual({
		exp: 'be~ki-li-',
		kana: 'ベッキーリー',
		syllables: 3,
		exist: false,
	});

	expect(ng.create({ random: random() }).kana).toBe('エミ'); // エミランダ
	expect(ng.create({ random: random() }).kana).toBe('サラ');
	expect(ng.create({ random: random() }).kana).toBe('アニー');
	expect(ng.create({ random: random() }).kana).toBe('シルヴィアナ');
	expect(ng.create({ random: random() }).kana).toBe('キャサ'); // キャサリー
	expect(ng.create({ random: random() }).kana).toBe('アリー'); // アリーナタリ
	expect(ng.create({ random: random() }).kana).toBe('ディア');
	expect(ng.create({ random: random() }).kana).toBe('シンディー');
	expect(ng.create({ random: random() }).kana).toBe('エイゼル');
	expect(ng.create({ random: random() }).kana).toBe('フローレジー');
	expect(ng.create({ random: random() }).kana).toBe('カトリー');

	expect(ng.create({ random: new MersenneTwister(22) })).toStrictEqual({
		exp: 'l-Sanon',
		kana: 'ルーシャノン',
		syllables: 3,
		exist: false,
	});

	console.log(
		[...Array(100)]
			.map(() => ng.create())
			.filter(({ exist }) => !exist)
			.map(({ kana }) => kana),
	);

	writeFile('./resolver/female-en.json', JSON.stringify(ng.data, null, 4));
});

test(`NameGenerator kana_en capital`, () => {
	const ng = new NameGenerator({
		random: new MersenneTwister(1),
		phonation: {
			consonantForVowels: 'capital',
		},
	});
	ng.add(kana_en, true);

	expect(ng.create()).toStrictEqual({
		exp: 'zad-li-n',
		kana: 'ザドーリーン',
		syllables: 3,
		exist: false,
	});

	console.log(
		`NameGenerator kana_en capital`,
		[...Array(100)]
			.map(() => ng.create())
			.filter(({ exist }) => !exist)
			.map(({ kana }) => kana),
	);

	writeFile(
		'./resolver/female-kana_en-capital.json',
		JSON.stringify(ng.data, null, 4),
	);
});

test(`NameGenerator en fr`, () => {
	const ng = new NameGenerator();
	ng.add(en);
	ng.add(fr);

	let s = 0;
	function random() {
		return new MersenneTwister(++s);
	}

	expect(ng.create({ random: random() })).toStrictEqual({
		exp: 'zeli-nu',
		kana: 'ゼリーヌ',
		syllables: 3,
		exist: false,
	});

	expect(ng.create({ random: random() })).toStrictEqual({
		exp: 'bli_aga~t',
		kana: 'ブリアガット',
		syllables: 3,
		exist: false,
	});

	expect(ng.create({ random: random() }).kana).toBe('エマニュエル');
	expect(ng.create({ random: random() }).kana).toBe('ウィレリレーヌ');
	expect(ng.create({ random: random() }).kana).toBe('アギャット');
	expect(ng.create({ random: random() }).kana).toBe('ガブリアナスター');
	expect(ng.create({ random: random() }).kana).toBe('セレス');
	expect(ng.create({ random: random() }).kana).toBe('アサ');
	expect(ng.create({ random: random() }).kana).toBe('イザ');
	expect(ng.create({ random: random() }).kana).toBe('コーデビーナ');
	expect(ng.create({ random: random() }).kana).toBe('エイリス');
	expect(ng.create({ random: random() }).kana).toBe('グレタビ');
	expect(ng.create({ random: random() }).kana).toBe('ルイザンド');
	expect(ng.create({ random: random() }).kana).toBe('クロティファビアト');
	expect(ng.create({ random: random() }).kana).toBe('サリー');
	expect(ng.create({ random: random() }).kana).toBe('ディアガ');
	expect(ng.create({ random: random() }).kana).toBe('ブレンダニア');

	expect(ng.create({ random: new MersenneTwister(22) })).toStrictEqual({
		exp: 'mili-nu',
		kana: 'ミリーヌ',
		syllables: 3,
		exist: false,
	});

	console.log(
		[...Array(100)]
			.map(() => ng.create())
			.filter(({ exist }) => !exist)
			.map(({ kana }) => kana),
	);

	writeFile('./resolver/female-en-fr.json', JSON.stringify(ng.data, null, 4));
});

test(`NameGenerator 2-gram`, () => {
	const ng = new NameGenerator({
		random: new MersenneTwister(1),
		// translator: {
		// 	consonantForVowels: 'capital',
		// },
	});
	ng.splitter = 2;
	ng.add(en);

	expect(ng.create()).toStrictEqual({
		exp: 'lvina_in',
		kana: 'ルヴィナイン',
		syllables: 0,
		exist: false,
	});

	console.log(
		`NameGenerator 2-gram`,
		[...Array(100)]
			.map(() => ng.create())
			.filter(({ exist }) => !exist)
			.map(({ kana }) => kana),
	);

	writeFile(
		'./resolver/female-en-2-gram.json',
		JSON.stringify(ng.data, null, 4),
	);
});

test(`NameGenerator 3-gram`, () => {
	const ng = new NameGenerator({
		splitter: 3,
		random: new MersenneTwister(1),
		phonation: {
			consonantForVowels: 'capital',
		},
	});
	ng.add(kana_en, true);

	expect(ng.create()).toStrictEqual({
		exp: 'lomi-liAm',
		kana: 'ロミーリアム',
		syllables: 0,
		exist: false,
	});

	console.log(
		'female-en-3-gram',
		[...Array(100)]
			.map(() => ng.create())
			.filter(({ exist }) => !exist)
			.map(({ kana }) => kana),
	);

	writeFile(
		'./resolver/female-en-3-gram.json',
		JSON.stringify(ng.data, null, 4),
	);
});
