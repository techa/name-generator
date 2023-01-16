import test from 'ava';
import { NameGenerator } from './NameGenerator.js';
import { MersenneTwister } from '../utils/random/MersenneTwister.js';

import { readFileSync, writeFileSync } from 'fs';
const list = readFileSync('./resource/exp/female-en.txt', 'utf-8').split('\n');

test(`NameGenerator en`, (t) => {
	const ng = new NameGenerator();
	ng.add(list);

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

	// writeFileSync(
	// 	'./resource/syllable/female-en.json',
	// 	JSON.stringify(ng.data, null, 4),
	// );
});
