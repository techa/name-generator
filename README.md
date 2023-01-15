# Name Generator
> 日本語ベースで西洋風の名前を自動生成する
> Automatic generation of Europe-style names based on Japanese

## 概要


## 名前表現（Name expression）

* `^`：先頭。語頭。（正規表現と同様）
* `$`：最後。語尾。（正規表現と同様）
* `-`：[長母音（ー）](https://ja.wikipedia.org/wiki/長母音)（long vowel）
* `~`：[長子音（ッ）](https://ja.wikipedia.org/wiki/長子音)（long consonant）
* `_`：母音を表す子音（Consonant for vowels）

### 未実装
* `?`：母音を表す子音を含む任意の子音（Any consonant）
* `!`：母音を表す子音を含まない任意の子音（Any consonant without _）
* `'`：無声音子音（kstpfKSTPF）
* `"`：有声音子音（gzdbvGZDBV）
* `%`：男性用子音
* `&`：女性用子音

* `[tdncT]`：非ウ段子音：子音のみで発音したときウ段にならない子音（tdnTcVBMGPK）

* `E`：基本的に「e」。非ウ子音のとき「i」


## Credit
* [欧羅巴人名録](https://www.worldsys.org/europe/)
* [アラブ人名・家名辞典](https://alarabiyah.sakura.ne.jp/category/words/name/)
