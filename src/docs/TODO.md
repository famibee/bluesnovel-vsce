# BlueSNovel / SKYNovel拡張機能 TODO

**このファイルの使い方**：下の「残件一覧」だけ見れば、いま何ができるか分かる。
**このファイルは「いま何をすべきか」だけを持つ。** 設計判断の根拠と経緯・調査結果・実測値（測定値・踏んだ罠・やらないと決めた理由）・宿題の詳細は [README.md](README.md) 。
完了分は CHANGELOG.md ・コミットメッセージへ移動。最終的にカラを目指す。

### ⚠️ 数字を書くかどうかの基準

**「状態」を書くと腐る。「出来事」を書けば腐らない。**
言い換えると、**判断の根拠になった数字は残し、現状報告の数字は消す**
（現状報告は次の変更で黙って嘘になる）。

| 書く（出来事・根拠） | 書かない（状態） |
|---|---|
| **期日・相手の都合**（8/23 以降、クールダウン30日） | **自分の成果物の現在値**（vsix が何 KB、いまの版番号） |
| **測定の記録**（2026-07-28 に測ったら 4.6ms）。日付とセットなら事実として固定される | **版ごとのサイズ一覧**。リリースのたびに更新が要る＝負債 |
| **観測した環境**（macOS / VSCode 1.130 で確認）。いつの話か分かる | **依存の版番号**。`package.json` に正があるものの写し |
| **「この版でないと動かない」という制約**（engines を満たさないフォークがある） | **完了の目印としての版番号**。CHANGELOG に正がある。**日付で足りる** |

サイズを知りたければ `bun run release_chk` が出す。

---

## 残件一覧

**決着した項目はこの一覧から行ごと消す**（経緯は各節に残す）。

### 期日あり

**現在なし。**

### 構造の作り直し

✅ **全て決着済み**（file-watch.md (A)〜(D)、build.md §3.10、
multiroot.md 不具合6件・リソース解放5件、`keywords` の `multi-root ready` 復帰、
「再検証するファイルを絞る」実装（2026-10-15）まで含む。経緯は各節参照）。

### いつでも安全に着手できる

| # | 内容 | 節 |
|---|---|---|
| 1 | 設定パネルの Preact 載せ替え：実機（VSCode）でライト・ダーク・ハイコントラストの目視確認 | 本ファイル「設定パネルの Preact 載せ替え」 |

### 前提が揃うまで着手できない

| # | 内容 | 何を待っているか | 節 |
|---|---|---|---|
| 1 | tmpwiz を `contributes.walkthroughs` に載せる | **v5.0.0 正式版まで待つ**（移行案内は v4.33.2 で先行公開済み。walkthrough はインストール時に自動で開くので、alpha 中に出すと落ち着いていない画面を全員に見せる） | [features.md](features.md) |
| 2 | テンプレ本体（tmp_cjs_hatsune 等、外部リポジトリ）の package.json 手改修。rimraf依存の除去は拡張機能側の自動パッチ（package.json改変）で機能的には対応済み（2026-09-14）。テンプレ側は devDependencies の `rimraf` 記載と旧スクリプト文言が残るだけの見た目上の負債 | Marketplace 再申請後の作業 | - |

### ❓ 判断待ち（こちらから確認したいこと）

**現在なし。**

⚠️ **判断を仰いだことは、その場で言うだけでなく必ずここへ書く。**
`.claude/settings.json` の件は口頭で指摘しただけで一覧に入れず、
**そのままコミットされた**（2026-07-28。その後 `.gitignore` の `.claude/` で
追跡外に戻した）。会話の流れに出しただけでは残らない。

---

## 0. 受付箱

質問・要望・不具合を受けたらまずここに書き、処理したら下の該当節へ移す。**常にカラを目指す。**

- 段階的開発環境準備 (2026-08-26)
	現状、ゲームエンジン使用者にはnodejs(win環境ではPython)＆拡張機能インストールをまとめてやらせているが、アプリビルドの瞬間までnodejsがいらないので、ビルドボタンを押すまで遅延できないかというアイディア。つまり初見の試用時に【拡張機能インストールだけでいい】という導入の簡単さを提供したい
	ただしwin環境ではアイコン作成機能などでPythonを使用しているので、Python依存を排除できないと実行は出来ないと思われる。
	この辺を検討したい、というTODO。

- Win側からの報告 (2026-09-17)
	build.md「Windows実機確認が必要な項目」の以下7件はまだ未着手（次のWin側作業機会に着手予定）：Dドライブでの起動／空白入りフォルダ名でのサムネイル・ホバーの`%3A`一致／診断表示位置／`revealFileInOS`・`env.openExternal`／pyftsubsetへの`c:/`パス／タスク実行のシェル連結／マルチルートでのLspWs解放。

## ✅ SKYNovel⇔BlueSNovel 切替ボタン【実装・動作確認済み・2026-11-11】

`Project.ts` の `#switchEngine()`。ESM テンプレ（`IS_NEW_TMP`）のプロジェクトだけが対象（cjs テンプレは
`PrjTreeItem.ts` の `hide` でボタン自体を出さない）。処理順・正規表現の中身はコードのコメント参照。
あわせて、エンジンを決め打っていた4箇所（`ActivityBar.ts` の `updPrjFromTmp`・`chkLastSNVer`、
`PrjSetting.ts` の `getLocalSNVer`・`#setTmp_save_ns`）も直した。

- **2026-11-11、GitHub から取得した tmp_blues を実ワークスペースにし、VSCode 拡張機能ホスト上で
	`skynovel.devCrypto`・`skynovel.devSwitchEngine` コマンドを実際に呼んで確認**（`@vscode/test-electron`
	で本物の VSCode を起動し、ツリーのボタンが呼ぶのと同じコマンドを実行。確認モーダルだけは
	VSCode のテスト安全機構が自動応答を拒むため、検証用に複製したコピー側でのみ固定応答にした。
	本体のコードは変更していない）。結果：暗号化→エンジン切替→自動的に新エンジン向けで再暗号化
	まで一通り通り、package.json・import 先・`main.ts`・`doc_crypto/`・`snsys_pre` プラグインが
	すべて期待どおりに書き変わった。switch 後に `npm i` → `vite` → ブラウザでも確認し、
	暗号化された本文がタイトル画面まで正しく復号・表示されることを確認した（コンソールエラー無し）
	- **この過程で実バグを1件発見・修正**：`#switchMainTs()` は `#replEngineImports()` の**後**に走るため、
	main.ts 内の import 先はその時点で既に新エンジン名に書き変わっている。にもかかわらず正規表現が
	旧エンジン名を探していたため、呼び出すたびに一致せず、BlueSNovel→SKYNovel方向で `appMain.registerScheme()` の
	削除が効かない不具合があった（旧エンジン名⇔新エンジン名を取り違えていた）。実機確認で発覚し修正済み
	- ⚠️ **未解明の事象**：`SwitchEngine_waited` の `npm i` タスクが、この自動テスト環境内では
	`tasks.executeTask()` 呼び出し後に完了しなかった（`touch` だけの最小タスクや、起動直後に走る
	「自動ビルド」タスクは同じ環境で正常に完了している）。package.json・import・main.ts の書き換えや
	暗号化はタスクを介さない直接処理なので無関係に正しく完了している。この1点だけ VSCode を
	普段どおり対話的に使って確かめることを勧める（`SnUpd`・`Crypto` も同じ仕組みで `npm` 系タスクを
	使うので、再現するなら本機能だけの問題ではない）
- **罠**：同じ `localhost` ポートで複数プロジェクトを続けてブラウザ確認すると、localStorage に残った
	前のプロジェクトのセーブデータが自動ロードされ、無関係な `[autowc]` 例外を「このプロジェクトの
	不具合」と見誤る。プロジェクトごとに `localStorage.clear()` するか、別ポートを使うこと

⚠️ ボタンが扱うのはビルド構成だけ。スクリプトのタグやプラグインが BlueSNovel で動くかは別問題

## 設定パネルの Preact 載せ替え【タブ実装・Vue 撤去済み・2026-11-12】

7タブ（基本情報・アプリ・テンプレ・デバッグ・画像最適化・音声最適化・パッケージ）とも Preact で実装し、
Vue 版（`views/vue/`・`views/store/`・依存 `vue`・`pinia`・`vee-validate`・`yup`・
`@img-comparison-slider/vue`・`@vitejs/plugin-vue`・`vite`、スクリプト `vue_bld`・`vue_bw`、
`types.ts` の `T_E2V_INITVUE`、`store.ts` の `case 'init.Vue'`）は撤去済み。
`chk:types`・`lint`・`test:ui`（30/30、ブラウザ環境に依存する Finder D&D 系を除く）は通る。
`tsconfig.chk.json` も `views/` 全体を検査対象に戻し、`tsconfig.json` の `noUnusedParameters` も
`true` に戻せた（Vue 由来の制約だったため）。

### 残作業

1. **実機（VSCode）でライト・ダーク・ハイコントラストの目視確認**：`views/stg/setting.css` は
	VSCode のテーマ変数＋ダーク寄りの既定値で書いたが、実際のテーマ切り替えでの見た目は未確認
	（ブラウザ単体プレビューでダーク配色は目視済み）
2. 実機で各タブの保存（`patchCfg`・`setWss`・`setTemp` 経由の `update.oCfg`/`update.oWss`/`update.aTemp`
	送信）とスイッチの取り消し（`notice.Component` の `cancel`）を確認

### 未確認

- ⚠️ BlueSNovel エンジンへ渡すデバッグ用コンポーネント（文字レイヤ・画像レイヤとして使う構想）は React コンポーネントである必要がある。
	hooks だけで書けば同じソースを React 向けにもビルドできるが、`onChange` の意味が Preact と React で違う点に注意

---


## 1. VS Marketplace 是正対応【詳細は非公開・`TODO.private.md` へ移動】

⚠️ **交渉の経緯（メール要約・時系列・判断根拠）等は `TODO.private.md`（git 管理外）へ**
このリポジトリは Public。削除の経緯や Microsoft とのやり取りの詳細は
公開しておく必要がないと判断したため（§0 参照）。

現在分かっている範囲の要約：

- コード側の是正（依存の整理・pip install の同意化、metadata の BlueSNovel 化）は完了済み（CHANGELOG 参照）
- 削除された旧拡張機能の ID は復活しないため、**新しい extension name
`famibee2.bluesnovel` で公開し直している**（[features.md](features.md)）
- **2026-10-09、publisher `famibee2` のブロックが解除された。**
- 旧版 `famibee2.skynovel2` の**再登録は技術的に不可能と確認済み**（削除済み拡張機能の
  名前・repository URL の内部レコードが残存し、新旧どちらの名前でも阻まれる）
- 新版の公開もこの残存レコード（repository URL・homepage URL）と衝突していたが、
  両URLを変更して回避し、**2026-10-15、`famibee2.bluesnovel` v4.33.2 の公開に成功**
  （Marketplace Gallery API で `validated, public` を確認）
- 残作業：コミット済み変更の push（ユーザー指示待ち）、Microsoft への返信（様子見）、
  旧 publisher `famibee`（2022年ロックアウト）の扱いの回答待ち
