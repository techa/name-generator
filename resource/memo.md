## 2文字言語別コード表
英語EN
ドイツ語DE
フランス語FR
イタリア語IT
スペイン語ES
スウェーデン語SV
フィンランド語FI
ロシア語RU
チェコ語CS
オランダ語NL


国別コードとはまた違う。
日本はJPで日本語はJAと共通していないものも結構ある。
スウェーデンの国別コードはSE


## ロシア姓は男性形と女性形で語尾変化する
https://www.worldsys.org/europe/tips-russian-names/
フ→ヴァ
ン→ナ
キー→カヤ
ой→ая：以下の２例しかない

Толстой
Tolstoy	トルストイ
Толстая
Tolstaya	トルスタヤ

Мостовой
Mostovoy	モストヴォイ
Мостовая
Mostovaya	モストヴァヤ

## 修正箇所
family-de.txt
Bücher	ブュヒャー→ビュヒャー


## 検索置換
origin/male-ru.test
[А-ё]+\n(\w+)\n([ァ-ヴー、（）・]+)\s*[А-ё]+\n\w+\n[ァ-ヴー、（）・]+\s*[А-ё]+\n\w+\n[ァ-ヴー、（）・]+
$1\t$2

origin/family-ru.test
[А-ё]+\n(\w+)\t([ァ-ヴー、（）・]+)\s*[А-ё]+\n(\w+)\t([ァ-ヴー、（）・]+)
$1\t$2

origin/family-cs.test
([\wá-ž]+)\t([ァ-ヴー、（）・]+)\t([\wá-ž]+)\t([ァ-ヴー、（）・]+)
$1\t$2
