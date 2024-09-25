import { expect, test } from 'vitest';
import { Phonation } from './Phonation.js';

test(`toKana`, () => {
	const trans = new Phonation();
	expect(trans.toKana('albaat')).toBe('アルバート');
	expect(trans.toKana('_alba-t')).toBe('アルバート');
	expect(trans.toKana('skaalett')).toBe('スカーレット');
	expect(trans.toKana('skaale~t')).toBe('スカーレット');
	expect(trans.toKana('skaalet~')).toBe('スカーレット');
	expect(trans.toKana('pannakotta')).toBe('パンナコッタ');
	expect(trans.toKana('pannako~ta')).toBe('パンナコッタ');
	expect(trans.toKana('pannakot~a')).toBe('パンナコッタ');
	expect(trans.toKana('tntn')).toBe('トントン');
	expect(trans.toKana('kottn')).toBe('コットン');
	expect(trans.toKana('ko~tn')).toBe('コットン');
	expect(trans.toKana('kot~on')).toBe('コットン');
	expect(trans.toKana('kot~n')).toBe('コトッン');

	expect(trans.toKana('l-Sa')).toBe('ルーシャ');

	expect(trans.toKana('Albaat')).toBe('アルバート');
	expect(trans.toKana('AIs')).toBe('アイス');
	expect(trans.toKana('Ais')).toBe('アィス');
	expect(trans.toKana('ais')).toBe('アイス');
	expect(trans.toKana('hais')).toBe('ハイス');
});

test(`fromKana`, () => {
	const trans = new Phonation();
	expect(trans.fromKana('アルバート')).toBe('_alba-t');
	expect(trans.fromKana('スカーレット')).toBe('ska-le~t');
	expect(trans.fromKana('パンナコッタ')).toBe('pannako~ta');
	expect(trans.fromKana('アダーシェク')).toBe('_ada-Sek');
	expect(trans.fromKana('アイス')).toBe('_a_is');
	expect(trans.fromKana('アィス')).toBe('_ais');

	expect(trans.fromKana('コトロゥタディンギャ')).toBe('kotlowtadinGa');
	expect(trans.fromKana('ウータ・バーシー')).toBe('_u-ta ba-Si-');

	expect(trans.fromKana('ウィット')).toBe('wi~t');
	expect(trans.fromKana('アウィット')).toBe('_awi~t');

	expect(trans.fromKana('クケナン')).toBe('kukenan');
});

test(`fromKana 2`, () => {
	const trans = new Phonation({
		longVowel: 'repeat',
		longConsonantPosition: 'after',
		consonantForVowels: 'capital',
	});
	expect(trans.fromKana('スカーレット')).toBe('skaalet~');
	expect(trans.fromKana('パンナコッタ')).toBe('pannakot~a');

	expect(trans.fromKana('アルバート')).toBe('Albaat');
	expect(trans.fromKana('アイス')).toBe('AIs');
	expect(trans.fromKana('アィス')).toBe('Ais');
});

test(`fromKana lower`, () => {
	const trans = new Phonation({
		longVowel: 'repeat',
		longConsonant: 'repeat',
		consonantForVowels: 'lower',
	});
	expect(trans.fromKana('スカーレット')).toBe('skaalett');
	expect(trans.fromKana('パンナコッタ')).toBe('pannakotta');

	expect(trans.fromKana('アルバート')).toBe('albaat');
	expect(trans.fromKana('アイス')).toBe('ais');
	expect(trans.fromKana('アィス')).toBe('ais');
});
