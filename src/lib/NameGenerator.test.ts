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
	});

	t.deepEqual(ng.create({ seed: seed() }), {
		exp: 'be~ki-li-',
		kana: 'ベッキーリー',
		syllables: 3,
	});

	t.is(ng.create({ seed: seed() }).kana, 'エミ'); // エミランダ
	t.is(ng.create({ seed: seed() }).kana, 'サラ');
	t.is(ng.create({ seed: seed() }).kana, 'アニー');
	t.is(ng.create({ seed: seed() }).kana, 'シルヴィアナ');
	t.is(ng.create({ seed: seed() }).kana, 'キャサ'); // キャサリー
	t.is(ng.create({ seed: seed() }).kana, 'アリー'); // アリーナタリ
	t.is(ng.create({ seed: seed() }).kana, 'ディア');
	t.is(ng.create({ seed: seed() }).kana, 'シンディー');
	t.is(ng.create({ seed: seed() }).kana, 'エイ');
	t.is(ng.create({ seed: seed() }).kana, 'フローレ');
	t.is(ng.create({ seed: seed() }).kana, 'カトリー');
	t.deepEqual(ng.create({ seed: 22 }), {
		exp: 'l-Sa',
		kana: 'ルーシャ',
		syllables: 2,
	});

	// console.log([...Array(100)].map(() => ng.create().kana));

	t.deepEqual(
		[...Array(100)].map(() => ng.create().kana),
		[
			'エステル',
			'ベサ',
			'チャーリー',
			'キャロ',
			'ミラ',
			'エメロン',
			'パッツィー',
			'アーシュ',
			'テリー',
			'シンシ',
			'スザンナディーン',
			'キティ',
			'ローズローズ',
			'タイン',
			'マーラナ',
			'ミアデビー',
			'ローズ',
			'マティル',
			'コーデニース',
			'ブレンダ',
			'ソニ',
			'フェリア',
			'アメーヴィス',
			'オリーヴ',
			'アーシュラ',
			'ブリアメーベル',
			'リカ',
			'マーティファニー',
			'ベサ',
			'クラリスタリー',
			'ディア',
			'キャサリー',
			'デニース',
			'パッツィー',
			'アリア',
			'タリオン',
			'アドリー',
			'バーサ',
			'スザンナ',
			'アシュリー',
			'ジョハンナ',
			'ジェニー',
			'アルバータビ',
			'ライオ',
			'アガ',
			'レミナ',
			'パティナ',
			'グロリア',
			'ジョーンジョーン',
			'マリー',
			'フレデリー',
			'ダフニー',
			'エノー',
			'ジュリージュリー',
			'アナスター',
			'マーティ',
			'アーリーン',
			'エノー',
			'メーベル',
			'セシリー',
			'アシュリー',
			'マイナ',
			'アリリクス',
			'アリシア',
			'エルシー',
			'モリー',
			'ミッシェル',
			'オーレイン',
			'アグネス',
			'コニー',
			'ラベル',
			'アニエル',
			'ローレッタ',
			'アニ',
			'グレースグレース',
			'オノー',
			'サンディー',
			'アマン',
			'エヴァ',
			'エミア',
			'ヨラン',
			'イヴリン',
			'アリサ',
			'チェルシー',
			'グレースグレース',
			'グロリア',
			'ジョアン',
			'ジェーンジェーン',
			'パメ',
			'セレディス',
			'トレーシー',
			'エリ',
			'エライン',
			'タリ',
			'リヴィ',
			'ベッカ',
			'ケイト',
			'コリン',
			'マーシー',
			'ニファー',
		],
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
	});

	t.deepEqual(ng.create({ seed: seed() }), {
		exp: 'bli_aga~t',
		kana: 'ブリアガット',
		syllables: 3,
	});

	t.is(ng.create({ seed: seed() }).kana, 'エマニュ');
	t.is(ng.create({ seed: seed() }).kana, 'ウィレリレー');
	t.is(ng.create({ seed: seed() }).kana, 'アギャット');
	t.is(ng.create({ seed: seed() }).kana, 'ガブリアナス');
	t.is(ng.create({ seed: seed() }).kana, 'セレス');
	t.is(ng.create({ seed: seed() }).kana, 'アサ');
	t.is(ng.create({ seed: seed() }).kana, 'イザ');
	t.is(ng.create({ seed: seed() }).kana, 'コーデビーナ');
	t.is(ng.create({ seed: seed() }).kana, 'エイ');
	t.is(ng.create({ seed: seed() }).kana, 'グレタ');
	t.is(ng.create({ seed: seed() }).kana, 'ルイザンド');
	t.deepEqual(ng.create({ seed: 22 }), {
		exp: 'mili-',
		kana: 'ミリー',
		syllables: 2,
	});

	// console.log([...Array(100)].map(() => ng.create().kana));

	t.deepEqual(
		[...Array(100)].map(() => ng.create().kana),
		[
			'ジェラルディーヌ',
			'ソフィ',
			'シンディーヌ',
			'ヒラ',
			'アイザ',
			'エメリー',
			'アイベル',
			'ジルベラン',
			'コート',
			'フロランス',
			'ルシーッルシール',
			'ヴィクトワール',
			'ジェルメーヌ',
			'ロクサンヌ',
			'レア',
			'マガ',
			'ニネット',
			'ディアナ',
			'カレン',
			'エドウィージュ',
			'グラディス',
			'アナ',
			'ステラ',
			'アンヌ',
			'カミ',
			'ルイサ',
			'ペトロ',
			'ヴィア',
			'ソフィー',
			'デラモーヌ',
			'イア',
			'ケイト',
			'シーライ',
			'ベッカリー',
			'アマンサ',
			'ジョルジェット',
			'アイリス',
			'ジュスチーヌ',
			'セレリア',
			'サヴァンジェ',
			'ブレンダ',
			'ジュリエン',
			'チェリー',
			'キーリー',
			'アルバータンス',
			'ゾエロ',
			'エグランジェール',
			'アンヌ',
			'サント',
			'ペネリー',
			'バータ',
			'エセル',
			'ロララ',
			'サント',
			'オノール',
			'アーナ',
			'エヴァ',
			'ナオディル',
			'クリスティファニー',
			'オーレンス',
			'ニタ',
			'アリディ',
			'アメーリエル',
			'ジェリー',
			'サラリーヌ',
			'マリ',
			'ルーシャ',
			'ダーナ',
			'ノーラ',
			'イオレ',
			'イザベス',
			'マリー',
			'セシビー',
			'ヴィクトリオン',
			'アーヌ',
			'アビー',
			'コーデリーク',
			'アニファー',
			'ヴィルジ',
			'ジョーダン',
			'アリアム',
			'クレマンダ',
			'ミレリー',
			'アンナ',
			'リシ',
			'ラニー',
			'シルヴィ',
			'クローディ',
			'リュシーリュシー',
			'エレ',
			'エロニー',
			'ジョルジェット',
			'マリーズ',
			'ブリジット',
			'セシルヴィ',
			'ダーラ',
			'パティ',
			'シビル',
			'キャスリーン',
			'レオラ',
		],
	);

	// writeFileSync(
	// 	'./resource/syllable/female-en.json',
	// 	JSON.stringify(ng.data, null, 4),
	// );
});
