import test from 'ava';
import { Translator } from './Translator.js';

test(`toKana`, (t) => {
	const trans = new Translator();
	t.is(trans.toKana('albaat'), 'アルバート');
	t.is(trans.toKana('_alba-t'), 'アルバート');
	t.is(trans.toKana('skaalett'), 'スカーレット');
	t.is(trans.toKana('skaale~t'), 'スカーレット');
	t.is(trans.toKana('skaalet~'), 'スカーレット');
	t.is(trans.toKana('pannakotta'), 'パンナコッタ');
	t.is(trans.toKana('pannako~ta'), 'パンナコッタ');
	t.is(trans.toKana('pannakot~a'), 'パンナコッタ');
	t.is(trans.toKana('tntn'), 'トントン');
	t.is(trans.toKana('kottn'), 'コットン');
	t.is(trans.toKana('ko~tn'), 'コットン');
	t.is(trans.toKana('kot~on'), 'コットン');
	t.is(trans.toKana('kot~n'), 'コトッン');

	t.is(trans.toKana('l-Sa'), 'ルーシャ');
});

test(`fromKana`, (t) => {
	const trans1 = new Translator();
	t.is(trans1.fromKana('アルバート'), '_alba-t');
	t.is(trans1.fromKana('スカーレット'), 'ska-le~t');
	t.is(trans1.fromKana('パンナコッタ'), 'pannako~ta');
	t.is(trans1.fromKana('アダーシェク'), '_ada-Sek');
	t.is(trans1.fromKana('アイス'), '_a_is');
	t.is(trans1.fromKana('アィス'), '_ais');

	t.is(trans1.fromKana('コトロゥタディンギャ'), 'kotlowtadinGa');
	t.is(trans1.fromKana('ウータ・バーシー'), '_u-taba-Si-');

	const trans2 = new Translator({
		longVowel: 'repeat',
		longConsonantPosition: 'after',
	});
	t.is(trans2.fromKana('スカーレット'), 'skaalet~');
	t.is(trans2.fromKana('パンナコッタ'), 'pannakot~a');
});
