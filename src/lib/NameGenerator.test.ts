import test from 'ava';
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

test(`NameGenerator en`, (t) => {
	const ng = new NameGenerator();
	ng.add(en);

	let s = 0;
	function random() {
		return new MersenneTwister(++s);
	}

	t.deepEqual(ng.create({ random: random() }), {
		exp: 'zad-li-n',
		kana: 'ザドーリーン',
		syllables: 3,
		exist: false,
	});

	t.deepEqual(ng.create({ random: random() }), {
		exp: 'be~ki-li-',
		kana: 'ベッキーリー',
		syllables: 3,
		exist: false,
	});

	t.is(ng.create({ random: random() }).kana, 'エミ'); // エミランダ
	t.is(ng.create({ random: random() }).kana, 'サラ');
	t.is(ng.create({ random: random() }).kana, 'アニー');
	t.is(ng.create({ random: random() }).kana, 'シルヴィアナ');
	t.is(ng.create({ random: random() }).kana, 'キャサ'); // キャサリー
	t.is(ng.create({ random: random() }).kana, 'アリー'); // アリーナタリ
	t.is(ng.create({ random: random() }).kana, 'ディア');
	t.is(ng.create({ random: random() }).kana, 'シンディー');
	t.is(ng.create({ random: random() }).kana, 'エイゼル');
	t.is(ng.create({ random: random() }).kana, 'フローレジー');
	t.is(ng.create({ random: random() }).kana, 'カトリー');
	t.deepEqual(ng.create({ random: new MersenneTwister(22) }), {
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

test(`NameGenerator kana_en capital`, (t) => {
	const ng = new NameGenerator();
	ng.random = new MersenneTwister(1);
	ng.translator.setOptions({
		consonantForVowels: 'capital',
	});
	ng.add(kana_en, true);

	t.deepEqual(ng.create(), {
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

test(`NameGenerator en fr`, (t) => {
	const ng = new NameGenerator();
	ng.add(en);
	ng.add(fr);

	let s = 0;
	function random() {
		return new MersenneTwister(++s);
	}

	t.deepEqual(ng.create({ random: random() }), {
		exp: 'zeli-nu',
		kana: 'ゼリーヌ',
		syllables: 3,
		exist: false,
	});

	t.deepEqual(ng.create({ random: random() }), {
		exp: 'bli_aga~t',
		kana: 'ブリアガット',
		syllables: 3,
		exist: false,
	});

	t.is(ng.create({ random: random() }).kana, 'エマニュエル');
	t.is(ng.create({ random: random() }).kana, 'ウィレリレーヌ');
	t.is(ng.create({ random: random() }).kana, 'アギャット');
	t.is(ng.create({ random: random() }).kana, 'ガブリアナスター');
	t.is(ng.create({ random: random() }).kana, 'セレス');
	t.is(ng.create({ random: random() }).kana, 'アサ');
	t.is(ng.create({ random: random() }).kana, 'イザ');
	t.is(ng.create({ random: random() }).kana, 'コーデビーナ');
	t.is(ng.create({ random: random() }).kana, 'エイリス');
	t.is(ng.create({ random: random() }).kana, 'グレタビ');
	t.is(ng.create({ random: random() }).kana, 'ルイザンド');
	t.is(ng.create({ random: random() }).kana, 'クロティファビアト');
	t.is(ng.create({ random: random() }).kana, 'サリー');
	t.is(ng.create({ random: random() }).kana, 'ディアガ');
	t.is(ng.create({ random: random() }).kana, 'ブレンダニア');
	t.deepEqual(ng.create({ random: new MersenneTwister(22) }), {
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

test(`NameGenerator 2-gram`, (t) => {
	const ng = new NameGenerator();
	ng.random = new MersenneTwister(1);
	ng.splitter = 2;
	// ng.translator.setOptions({
	// 	consonantForVowels: 'capital',
	// });
	// ng.add(kana_en, true);
	ng.add(en);

	t.deepEqual(ng.create(), {
		exp: 'lvin',
		kana: 'ルヴィン',
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

test(`NameGenerator 3-gram`, (t) => {
	const ng = new NameGenerator();
	ng.random = new MersenneTwister(1);
	ng.splitter = 3;
	ng.translator.setOptions({
		consonantForVowels: 'capital',
	});
	ng.add(kana_en, true);

	t.deepEqual(ng.create(), {
		exp: 'lomi-l',
		kana: 'ロミール',
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
