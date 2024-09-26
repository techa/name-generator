# Name Generator
> カタカナの名前リストから名前を自動生成する
> Automatic generation of names based on Japanese-Katakana

### 生成手順
* カタカナを発音表記に変換
    * `アルバート` -> `_alba-t`
* 発音記号を分解（デフォルトでは音節[Syllable](https://ja.wikipedia.org/wiki/音節)で分解）
	* `_alba-t` -> `_al`、`ba-t`
* 次に続くものをカウントする
	* `_al`、`ba-t`の場合`_al`のデータに`ba-t`のカウントを＋１する`{_al: {ba-t: 1}}`
	* `アルフォンス`を追加。`{_al: {ba-t: 1, fons: 1}}`
* カウントに応じた確率で次の文字が選ばれる


## 発音表記：名前表現（Name expression）
* `^`：先頭。語頭。（正規表現と同様）
* `$`：最後。語尾。（正規表現と同様）
* `-`：[長母音（ー）](https://ja.wikipedia.org/wiki/長母音)（long vowel）
	* または`aa`のように母音を連続させる
* `~`：[長子音（ッ）](https://ja.wikipedia.org/wiki/長子音)（long consonant）
	* または`kk`のように子音を連続させる
* `_`：母音を表す子音（Consonant for vowels）
	* または`A`のように母音を大文字にする
* 大文字子音：「`Ka`→キャ」「`Sa`→シャ」

### 未実装
* `?`：母音を表す子音を含む任意の子音（Any consonant）
* `!`：母音を表す子音を含まない任意の子音（Any consonant without _）
* `'`：無声音子音（kstpfKSTPF）
* `"`：有声音子音（gzdbvGZDBV）

* `[ntdcTKPGBNM]`：非ウ段子音：子音のみで発音したときウ段にならない子音
	* `n`：ン
	* `[td]`：トorド。オ(o)
	* `[cTKPGBNM]`：イ(i)

* `（ei）`：基本的に「e」。非ウ子音のとき「i」


## Credit
* [欧羅巴人名録](https://www.worldsys.org/europe/)
* [アラブ人名・家名辞典](https://alarabiyah.sakura.ne.jp/category/words/name/)
