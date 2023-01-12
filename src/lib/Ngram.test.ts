import test from 'ava';
import { Ngram } from './Ngram.js';

import { readFileSync } from 'fs';
const list = readFileSync('./resource/exp/female-en.txt', 'utf-8');

test(`Ngram: female-en`, (t) => {
	const ngram = new Ngram();
	ngram.add(list.split('\n'));
	// console.log('aaa', JSON.stringify(ngram.data, null, 4));
	const count = [2, 6] as [number, number];

	t.is(ngram.create({ seed: 1, count }), 'lvil');
	t.is(ngram.create({ seed: 2, count }), '_omo');
	t.is(ngram.create({ seed: 3, count }), 'l_il');
	t.is(ngram.create({ seed: 4, count }), 'gano-_');
});

test(`Ngram: kana/female-en`, (t) => {
	const ngram = new Ngram();
	ngram.add(
		readFileSync('./resource/kana/female-en.txt', 'utf-8').split('\n'),
	);

	// console.log('aaa', JSON.stringify(ngram.data, null, 4));
	const count = [2, 6] as [number, number];
	const names = [
		'リネット',
		'アトリネ',
		'リサ',
		'ジェシドニス',
		'ニカ',
		'クス',
		'マデ',
		'トニーロッパ',
		'ジナ',
		'アーナディク',
		'アミ',
		'ルド',
		'キティヴィン',
		'マリオン',
		'バリーリーゴ',
		'ジアナー',
		'ジュデニ',
		'ジョセル',
		'メラ',
		'ポリービ',
		'セリ',
		'フランタ',
		'ソン',
		'ロン',
		// 'リステル',
		'ジョーリアガ',
	];

	for (let i = 0; i < names.length; i++) {
		t.is(ngram.create({ seed: i + 1, count }), names[i]);
	}
});

test(`Ngram: 'アイリス', 'アイス'`, (t) => {
	const ngram = new Ngram();
	ngram.add(['アイリス', 'アイス']);
	t.deepEqual(ngram.data, {
		'^': {
			char: '^',
			total: 2,
			nexts: {
				ア: 2,
			},
		},
		アイ: {
			char: 'アイ',
			total: 2,
			nexts: {
				リ: 1,
				ス: 1,
			},
		},
		イリ: {
			char: 'イリ',
			total: 1,
			nexts: {
				ス: 1,
			},
		},
		イス: {
			char: 'イス',
			total: 1,
			nexts: {
				$: 1,
			},
		},
		リス: {
			char: 'リス',
			total: 1,
			nexts: {
				$: 1,
			},
		},
	});
});
