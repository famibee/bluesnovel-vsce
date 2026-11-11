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
| 1 | 設定パネルを Vue から Preact へ載せ替え（土台まで済み。残りはタブの中身・CSS・Vue の撤去） | 本ファイル「設定パネルの Preact 載せ替え」 |

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

## 設定パネルの Preact 載せ替え【作業中・2026-11-11 に土台まで】

**いまの状態**：設定パネルは新しい `views/setting.htm`（Preact）を読んでいて、**タブだけ出て中身は空**。
このため `test:ui` は 30 件中 4 件（スライダー・必須項目の検証 × 2 プロジェクト）が落ちる。下の 1 が済めば通る。
Vue 版のファイルと依存はまだ残っている（どこからも読まれない）。

### 決めたこと

- ビルドは esbuild（`tools/build.ts` の「設定画面（Preact）」）。`views/stg/setting.tsx` → `views/setting.js`・`views/setting.css`。Vite は撤去する
- 状態は zustand のストア1つ（`views/stg/store.ts`）。esbuild の `alias` で `react` → `preact/compat`
- **本体へ送るのは利用者が操作したときだけ**。受信はストアに入れるだけで送り返さない（`store.ts` 冒頭）。
	これに合わせて `WfbSettingSn.ts` のエコー抑止フラグは外した
- 不正な数値（空欄・小数）は本体へ送らない。数値欄は部品側で入力中の文字列を持ち、検証を通ったときだけ `patchCfg()` を呼ぶ。
	文字列項目は検証エラーでも送る（テンプレ既定値のままでも保存できる必要がある）
- Bootstrap は使わない。`views/stg/setting.css` に VSCode のテーマ変数で書く。`views/lib/bootstrap2vscode.css` は
	他の5画面用なのでリンクしない（変数名は `--vscode-tab-inactiveForeground` のように元の大文字小文字のまま。
	`bootstrap2vscode.css` のケバブ表記は効いていない）
- 通信の型（`T_E2V`・`T_V2E`）は変えない

### 残作業（この順で）

1. **タブの中身を1つずつ**：デバッグ → パッケージ → 音声最適化 → 画像最適化 → テンプレ → 基本情報・アプリ。
	`views/stg/Stg*.tsx` を作り、`App.tsx` の `A_TAB` の `cmp` に入れる。元は `views/vue/Stg*.vue`
	- 共通部品は `parts.tsx`、検証は `validate.ts`（DOM に触らない純関数。文言は Vue 版のまま）
	- `test:ui` が見ているもの：`#app`、`#nav-{id}-tab`・`#nav-{id}` と class `active`、
		`id="cnv.mat.webp_quality"`（`fill('45')`＋`change` の後も 45）、基本情報タブの「必須入力項目です」
	- range は `onInput` で `setWss()`、`onChange`（Preact ではネイティブの change＝離したとき）で `sendPicQDef()`・`sendPicQ()`
	- range・ラジオの値は `Number()` で入れる。`cnv.icon.shape` が数値で届いても受け手
		（`WfbOptPic.ts` の `shape` の先）が動くか確かめる（Vue 版は文字列を送っていた）
	- 画像最適化：Bootstrap の collapse は無いので、開いている行の名前を1つ持ち、その行だけ比較スライダーを描く。
		画像 URL には `picRev` を付ける（描画のたびに時刻を付けない）
	- 比較スライダーは `img-comparison-slider`（Web Component）を直接使う。直接の依存に足し、
		`setting.tsx` で本体と `dist/styles.css` を import、JSX 用の型宣言を `views/stg/env.d.ts` に足す
	- Vue 版の不具合は写さない：フォント表の Open ボタンの id 重複、「暗号化しないフォルダ」のラベルの `for` 抜け、
		背景色の検証 `/#\d{6}/`（a〜f を弾く）
2. **CSS**：ライト・ダーク・ハイコントラストで目視
3. **撤去**：`views/vue/`・`views/store/`・`views/setting.html`・`views/setting.ts`・`views/vite.config.mts`・`views/@types/env.d.ts`、
	依存 `vue`・`pinia`・`vee-validate`・`yup`・`@img-comparison-slider/vue`・`@vitejs/plugin-vue`・`vite`、
	スクリプト `vue_bld`・`vue_bw` と `build`・`watch`・`vscode:prepublish` からの呼び出し、
	`types.ts` の `T_E2V_INITVUE` と `store.ts` の `case 'init.Vue'`
4. **周辺の追従**：`.vscodeignore` の Vue・`setting.html` の行、`eslint.config.mts` の「vue の store のみ」、
	`tsconfig.json` の `noUnusedParameters` の注記、`tsconfig.chk.json` に `views/` 全体を入れられるか、
	`tools/build.ts` の Vite のコメントアウト跡、`test/ui/runUI.ts` のコメントの「Vue」、
	[features.md](features.md) の「Vue のままでよい」、[release.md](release.md) のビルド説明、CHANGELOG
5. **確認**：`chk:types`・`lint`・`test:ui`・`release_chk`、実機で各タブの保存とスイッチの取り消し

### 未確認

- ストアの受信（`store.ts` の `recv()`）は型検査だけで、実画面では試せていない（表示するタブがまだ無い）。1 の最初のタブで確かめる
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
