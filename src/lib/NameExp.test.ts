import { expect, test } from 'vitest';
import { consonants } from '../constants/char.js';
import { NameExp } from './NameExp.js';

test(`?el`, () => {
	const nameexp = new NameExp('?el');
	expect(nameexp.datas).toStrictEqual([
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

	expect(nameexp.test('vel')).toBeTruthy();
	expect(nameexp.test('ven')).toBeFalsy();
	expect(nameexp.spreadAll()).toStrictEqual([
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

test(`[?-l]el[nmvf][ae]`, () => {
	const nameexp = new NameExp('[?-l]el[nmvf][ae]');
	expect(nameexp.datas).toStrictEqual([
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

	expect(nameexp.test('felva')).toBeTruthy();
	expect(nameexp.test('midna')).toBeFalsy();
	expect(nameexp.test('lelve')).toBeFalsy();

	expect(nameexp.spreadAll().length).toBe(272);
	// console.log('nameexp', nameexp.spreadAll());
	// console.log('nameexp', [...new Set(nameexp.spreadAll())]);
});

test(`combine`, () => {
	const nameexp = new NameExp('tel');
	expect(nameexp.combine('til')).toBe('t[ei]l');
	expect(nameexp.combine('dil')).toBe(undefined);
	expect(nameexp.combine('dis')).toBe(undefined);
	expect(new NameExp('t[ei]l').combine('tal')).toBe('t[aei]l');
	expect(new NameExp('t[ei]l').combine('til')).toBe('t[ei]l');
	expect(new NameExp('t[ei]l').combine('tis')).toBe(undefined);
	expect(new NameExp('[bhm]ali').combine('[S_dk]ali')).toBe('[S_bdhkm]ali');

	expect(new NameExp('t[ei][ls]').combine('til')).toBe('t[ei][ls]');
});

test(`isMultiple`, () => {
	expect(new NameExp('tel').isMultiple()).toBe(false);
	expect(new NameExp('t[ei]l').isMultiple()).toBe(true);
});
