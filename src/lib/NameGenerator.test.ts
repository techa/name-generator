import test from 'ava';
import { NameGenerator } from './NameGenerator.js';

import { readFileSync, writeFileSync } from 'fs';
const list = readFileSync('./resource/exp/female-en.txt', 'utf-8').split('\n');

test(`NameGenerator en`, (t) => {
	const ng = new NameGenerator();
	ng.add(list);

	let s = 0;
	function seed() {
		return ++s;
	}

	t.deepEqual(ng.create({ seed: seed() }), {
		exp: 'zad-li-n',
		kana: 'ザドーリーン',
		syllables: 3,
		exist: false,
	});

	t.deepEqual(ng.create({ seed: seed() }), {
		exp: 'be~ki-li-',
		kana: 'ベッキーリー',
		syllables: 3,
		exist: false,
	});

	t.is(ng.create({ seed: seed() }).kana, 'エミ'); // エミランダ
	t.is(ng.create({ seed: seed() }).kana, 'サラ');
	t.is(ng.create({ seed: seed() }).kana, 'アニー');
	t.is(ng.create({ seed: seed() }).kana, 'シルヴィアナ');
	t.is(ng.create({ seed: seed() }).kana, 'キャサ'); // キャサリー
	t.is(ng.create({ seed: seed() }).kana, 'アリー'); // アリーナタリ
	t.is(ng.create({ seed: seed() }).kana, 'ディア');
	t.is(ng.create({ seed: seed() }).kana, 'シンディー');
	t.is(ng.create({ seed: seed() }).kana, 'エイゼル');
	t.is(ng.create({ seed: seed() }).kana, 'フローレジー');
	t.is(ng.create({ seed: seed() }).kana, 'カトリー');
	t.deepEqual(ng.create({ seed: 22 }), {
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

	// writeFileSync(
	// 	'./resource/syllable/female-en.json',
	// 	JSON.stringify(ng.data, null, 4),
	// );
});

test(`NameGenerator en fr`, (t) => {
	const ng = new NameGenerator();
	ng.add(list);
	ng.add(readFileSync('./resource/exp/female-fr.txt', 'utf-8').split('\n'));

	let s = 0;
	function seed() {
		return ++s;
	}

	t.deepEqual(ng.create({ seed: seed() }), {
		exp: 'zeli-nu',
		kana: 'ゼリーヌ',
		syllables: 3,
		exist: false,
	});

	t.deepEqual(ng.create({ seed: seed() }), {
		exp: 'bli_aga~t',
		kana: 'ブリアガット',
		syllables: 3,
		exist: false,
	});

	t.is(ng.create({ seed: seed() }).kana, 'エマニュエル');
	t.is(ng.create({ seed: seed() }).kana, 'ウィレリレーヌ');
	t.is(ng.create({ seed: seed() }).kana, 'アギャット');
	t.is(ng.create({ seed: seed() }).kana, 'ガブリアナスター');
	t.is(ng.create({ seed: seed() }).kana, 'セレス');
	t.is(ng.create({ seed: seed() }).kana, 'アサ');
	t.is(ng.create({ seed: seed() }).kana, 'イザ');
	t.is(ng.create({ seed: seed() }).kana, 'コーデビーナ');
	t.is(ng.create({ seed: seed() }).kana, 'エイリス');
	t.is(ng.create({ seed: seed() }).kana, 'グレタビ');
	t.is(ng.create({ seed: seed() }).kana, 'ルイザンド');
	t.is(ng.create({ seed: seed() }).kana, 'クロティファビアト');
	t.is(ng.create({ seed: seed() }).kana, 'サリー');
	t.is(ng.create({ seed: seed() }).kana, 'ディアガ');
	t.is(ng.create({ seed: seed() }).kana, 'ブレンダニア');
	t.deepEqual(ng.create({ seed: 22 }), {
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

	// writeFileSync(
	// 	'./resource/syllable/female-en.json',
	// 	JSON.stringify(ng.data, null, 4),
	// );
});
