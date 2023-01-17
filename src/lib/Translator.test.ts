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

	t.is(trans.toKana('Albaat'), 'アルバート');
	t.is(trans.toKana('AIs'), 'アイス');
	t.is(trans.toKana('Ais'), 'アィス');
	t.is(trans.toKana('ais'), 'アイス');
	t.is(trans.toKana('hais'), 'ハイス');
});

test(`fromKana`, (t) => {
	const trans = new Translator();
	t.is(trans.fromKana('アルバート'), '_alba-t');
	t.is(trans.fromKana('スカーレット'), 'ska-le~t');
	t.is(trans.fromKana('パンナコッタ'), 'pannako~ta');
	t.is(trans.fromKana('アダーシェク'), '_ada-Sek');
	t.is(trans.fromKana('アイス'), '_a_is');
	t.is(trans.fromKana('アィス'), '_ais');

	t.is(trans.fromKana('コトロゥタディンギャ'), 'kotlowtadinGa');
	t.is(trans.fromKana('ウータ・バーシー'), '_u-ta ba-Si-');

	t.is(trans.fromKana('ウィット'), 'wi~t');
	t.is(trans.fromKana('アウィット'), '_awi~t');
});

test(`fromKana 2`, (t) => {
	const trans = new Translator({
		longVowel: 'repeat',
		longConsonantPosition: 'after',
		consonantForVowels: 'capital',
	});
	t.is(trans.fromKana('スカーレット'), 'skaalet~');
	t.is(trans.fromKana('パンナコッタ'), 'pannakot~a');

	t.is(trans.fromKana('アルバート'), 'Albaat');
	t.is(trans.fromKana('アイス'), 'AIs');
	t.is(trans.fromKana('アィス'), 'Ais');
});

test(`fromKana lower`, (t) => {
	const trans = new Translator({
		longVowel: 'repeat',
		longConsonant: 'repeat',
		consonantForVowels: 'lower',
	});
	t.is(trans.fromKana('スカーレット'), 'skaalett');
	t.is(trans.fromKana('パンナコッタ'), 'pannakotta');

	t.is(trans.fromKana('アルバート'), 'albaat');
	t.is(trans.fromKana('アイス'), 'ais');
	t.is(trans.fromKana('アィス'), 'ais');
});
