import test from 'ava';
import { consonants } from '../constants/char.js';
import { NameExp } from './NameExp.js';

test(`?el`, (t) => {
	const nameexp = new NameExp('?el');
	t.deepEqual(nameexp.datas, [
		{
			index: 0,
			source: '?',
			chars: [...consonants],
		},
		{
			index: 1,
			source: 'e',
			chars: ['e'],
		},
		{
			index: 2,
			source: 'l',
			chars: ['l'],
		},
	]);

	t.true(nameexp.test('vel'));
	t.false(nameexp.test('ven'));
	t.deepEqual(nameexp.spreadAll(), [
		'_el',
		'yel',
		'wel',
		'kel',
		'sel',
		'tel',
		'pel',
		'fel',
		'gel',
		'zel',
		'del',
		'bel',
		'vel',
		'Kel',
		'cel',
		'Sel',
		'Tel',
		'Pel',
		'Fel',
		'Gel',
		'Zel',
		'jel',
		'Del',
		'Bel',
		'Vel',
		'hel',
		'Hel',
		'xel',
		'nel',
		'Nel',
		'mel',
		'Mel',
		'rel',
		'lel',
		'Rel',
	]);
});

test(`[?-l]el[nmvf][ae]`, (t) => {
	const nameexp = new NameExp('[?-l]el[nmvf][ae]');
	t.deepEqual(nameexp.datas, [
		{
			index: 0,
			source: '[?-l]',
			chars: [...'_ywkstpfgzdbvKcSTPFGZjDBVhHxnNmMrR'],
		},
		{
			index: 1,
			source: 'e',
			chars: ['e'],
		},
		{
			index: 2,
			source: 'l',
			chars: ['l'],
		},
		{
			index: 3,
			source: '[nmvf]',
			chars: [...'nmvf'],
		},
		{
			index: 4,
			source: '[ae]',
			chars: [...'ae'],
		},
	]);

	t.true(nameexp.test('felva'));
	t.false(nameexp.test('midna'));
	t.false(nameexp.test('lelve'));

	t.is(nameexp.spreadAll().length, 272);
	// console.log('nameexp', nameexp.spreadAll());
	// console.log('nameexp', [...new Set(nameexp.spreadAll())]);
});

test(`combine`, (t) => {
	const nameexp = new NameExp('tel');
	t.is(nameexp.combine('til'), 't[ei]l');
	t.is(nameexp.combine('dil'), undefined);
	t.is(nameexp.combine('dis'), undefined);
	t.is(new NameExp('t[ei]l').combine('tal'), 't[aei]l');
	t.is(new NameExp('t[ei]l').combine('til'), 't[ei]l');
	t.is(new NameExp('t[ei]l').combine('tis'), undefined);
	t.is(new NameExp('[bhm]ali').combine('[S_dk]ali'), '[S_bdhkm]ali');

	t.is(new NameExp('t[ei][ls]').combine('til'), 't[ei][ls]');
});

test(`isMultiple`, (t) => {
	t.is(new NameExp('tel').isMultiple(), false);
	t.is(new NameExp('t[ei]l').isMultiple(), true);
});
