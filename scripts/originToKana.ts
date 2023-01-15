import { readFileSync, writeFileSync } from 'fs';
import { types, langs } from './constants.js';

for (const type of types) {
	for (const lang of langs) {
		const kanas = new Set();

		const names = (str: string) => {
			if (/・/.test(str)) {
				return str.split(/・/).at(-1);
			} else if (/＝/.test(str)) {
				return str
					.split(/[＝]/g)
					.map((v) => {
						if (kanas.has(v)) {
							return '';
						}
						kanas.add(v);
						return v + '\n';
					})
					.join('');
			}
			return str;
		};

		const text = readFileSync(
			`./resource/origin/${type}-${lang}.txt`,
			'utf-8',
		).replace(
			/[\S ]+?\t([ァ-ヴー・、＝（）]+)(?:\r?\n|$)/gm,
			(_, kana: string) => {
				if (/（[ァ-ヴー・＝、]+）/.test(kana)) {
					kana = kana.replace(/\S+（([ァ-ヴー・＝、]+)）/, '$1');
				} else if (/、/.test(kana)) {
					// 、で分割してどちらも候補に加える
					return kana
						.split(/[、]/g)
						.map((v) => {
							v = names(v);
							if (kanas.has(v)) {
								return '';
							}
							kanas.add(v);
							return v + '\n';
						})
						.join('');
				}

				kana = names(kana);

				if (!/＝/.test(kana)) {
					// 重複を取り除く
					if (kanas.has(kana)) {
						// console.log(type, lang, p1);
						return '';
					}
					kanas.add(kana);
				}
				return kana + '\n';
			},
		);

		writeFileSync(
			`./resource/kana/${type}-${lang}.txt`,
			text.replace(/\n{2,}/gm, '\n'),
		);
	}
}
