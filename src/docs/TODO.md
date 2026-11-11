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
| 1 | 本家⇔分家（SKYNovel⇔BlueSNovel）ワンタッチ切替ボタンの実装（2026-11-11 実装すると決定・設計済み） | 本ファイル「本家⇔分家 切替ボタン」 |
| 2 | パッチ生成ツールの環境・コード削除（2026-11-11 廃止決定。過去ソースは GitHub に残る） | 本ファイル「パッチ生成ツールの削除範囲」 |

### 前提が揃うまで着手できない

| # | 内容 | 何を待っているか | 節 |
|---|---|---|---|
| 1 | tmpwiz を `contributes.walkthroughs` に載せる | **v5.0.0 正式版まで待つ**（移行案内は v4.33.2 で先行公開済み。walkthrough はインストール時に自動で開くので、alpha 中に出すと落ち着いていない画面を全員に見せる） | [features.md](features.md) |
| 2 | テンプレ本体（tmp_cjs_hatsune 等、外部リポジトリ）の package.json 手改修。rimraf依存の除去は拡張機能側の自動パッチ（package.json改変）で機能的には対応済み（2026-09-14）。テンプレ側は devDependencies の `rimraf` 記載と旧スクリプト文言が残るだけの見た目上の負債 | Marketplace 再申請後の作業 | - |

### ❓ 判断待ち（こちらから確認したいこと）

- 設定パネル（Vue製）の載せ替え先 (2026-11-11)
	React へ載せ替える方針（2026-09-14）は撤回し、よりコンパクトな技術を再選定することになった。
	候補は Preact・Svelte・Alpine.js。**Preact（＋手書きバリデーション、vee-validate/yup/pinia を外す）を推奨**したが未確定。
	- 判断材料：分家エンジンは React 19 + zustand。Preact なら hooks/JSX の書き方が分家と揃う。
	Svelte はフォーム記述が最短だが分家と別の流儀が増える。Alpine.js は型検査が効かない
	- 対象は `views/vue` 8ファイル＋ `views/store` 5ファイル、合計約1150行
	- 2026-11-11 時点のビルド成果物は `setting.js` 279KB・`setting.css` 236KB（CSS は Bootstrap）
	- ⚠️ 分家エンジンへ渡すデバッグ用コンポーネント（文字レイヤ・画像レイヤとして使う構想）は、
	分家の React ツリーに載る以上 React コンポーネントである必要がある。設定パネルの技術選定とは別問題


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

## 本家⇔分家 切替ボタン【設計済み・未実装・2026-11-11】

ESM テンプレ（`IS_NEW_TMP`）のプロジェクトだけが対象。cjs テンプレには分家が無いのでボタンを出さない。
⚠️ **以下のパス（`src/web.ts` 等）は移行対象のゲームプロジェクト側のもので、この sn_extension リポジトリには存在しない。**

### 処理順（`Project.ts` に `#switchEngine()` を新設。逆方向は置換の向きが逆になるだけ）

1. 確認ダイアログ（modal）。git の未コミット変更があれば警告する（巻き戻し手段は git）。`#termDbgSS()` で実行中のものを止める
2. 暗号化中なら `#tglCryptoMode()` で解除し、暗号化していたことを覚えておく
	（`doc_crypto/`・`snsys_pre` プラグインが消え、`SysWeb`/`SysApp` の引数が `(hPlg)` に戻る）
3. `package.json`：`dependencies` のキーを `@famibee/skynovel_esm` ⇔ `@famibee/bluesnovel` に付け替え、
	`repository.url` を `tmp_esm_uc` ⇔ `tmp_blues` に書き換える
4. import 先の書き換え：`src/**/*.ts` と `vite*.config.ts` の `@famibee/skynovel_esm` ⇔ `@famibee/bluesnovel`
	（サブパス `/web`・`/app`・`/appMain` はそのまま）
5. `src/main/main.ts` の構造差分を当てる（2026-11-11 に tmp_esm_uc と tmp_blues を diff して確認）。
	分家はパッケージ版で `file://` の `fetch()` が使えないため、カスタムスキームで開く：
	- `appMain` を静的 import にし、トップレベルで `appMain.registerScheme()` を呼ぶ
	- `const {appMain} = await import('…/appMain')` の位置に `appMain.handleScheme(resolve(__dirname, '../renderer'))`
	- `w.loadFile(resolve(__dirname, '../renderer/index.html'))` → `w.loadURL('app://bundle/index.html')`

	パターンが一致しなければ書き換えず、手作業が必要な旨を警告する（ブラウザ実行には影響しない。影響するのはパッケージ版アプリだけ）
6. `actBar.updPrjFromTmp()` を呼び、切替先テンプレの依存・scripts・`vite.electron.config.ts` を取り込む
	（3. で `repository.url` を直してあるので切替先テンプレから取得される）。続けて `SnUpd_waited` のタスクでインストール
7. キャッシュの破棄：`Project.#is_blues` を undefined に戻し、`skynovel.isBlues` コンテキストを更新する。
	`HDiff` はコンストラクタで `isBlues` を受け取って保持しているので、取得関数を渡す形に変える
8. 2. で暗号化していたなら `#tglCryptoMode()` で再暗号化する（鍵 `pass.json` は解除しても残る）。
	分家なら `.bin` 化なし・`snsys_pre_blues` テンプレ・`dip: ''` 付きで作り直される
9. ウィンドウ再読み込みを促す（LSP は `ready` の `is_blues` で辞書を差し替えるだけで、戻す経路が無い）

### あわせて直す、拡張機能側の本家決め打ち

- `ActivityBar.ts` `updPrjFromTmp`：`lib_name` が `@famibee/skynovel(_esm)` 固定。分家ではローカル参照の引き継ぎが効かない。
	また `v?.startsWith('ile:')` は `slice(1)` していない値に対する判定なので `file:` に一致しない
- `PrjSetting.ts` `getLocalSNVer`：同じく `lib_name` 固定で、分家プロジェクトは `ver_sn` が空になる
- `ActivityBar.ts` `chkLastSNVer`：取得するのは skynovel_esm・tmp_esm_uc・SKYNovel・tmp_cjs_uc だけ。
	分家プロジェクトのテンプレ版を tmp_esm_uc の版と比べてしまう。bluesnovel・tmp_blues の取得と `T_LocalSNVer` への `is_blues` 追加が要る
- `PrjSetting.ts` `#setTmp_save_ns` に `tmp_blues` が無い

### 動作確認（実装後）

`~/Documents/MacHD2/_Ugai/sn_ver/sn_osk_gitayu`（本家形式・暗号化あり）で、本家→分家→本家と切り替え、
それぞれ `web` タスクでブラウザ実行する。コンソールにエラーが無いこと・タイトル画面から数行進められることを確認する。
⚠️ このプロジェクトには未コミットのステージ済み変更がある（2026-11-11 確認）。切替前にコミットするか複製で試す。
⚠️ ボタンが扱うのはビルド構成だけ。スクリプトのタグやプラグインが分家で動くかは別問題

## パッチ生成ツールの削除範囲【未実施・2026-11-11】

- フォルダ：`patch_app/`・`patch_gen_gui/`・`.claude/skills/patch-gen-gui-dev/`
- ソース：`src/genLegacyPatch.ts`・`src/InstallerExtract.ts`・`src/probeInstaller.ts`・`src/LegacyAppCheck.ts`・`src/DownloadUrlCheck.ts`
- テスト：`test/LegacyAppCheck.test.ts`・`test/InstallerExtract.test.ts`・`test/DownloadUrlCheck.test.ts`
- 設定：`.gitignore` の Rust 節、`.vscodeignore` の `patch_app/`・`patch_gen_gui/` と説明コメント
- 依存：`7zip-bin`・`@electron/asar` は、他に使用箇所が無いことを確かめてから外す
- 文書：`legacy-app-patch.md`、README.md の索引行、features.md の「過去アプリ向けパッチ配布」の項
- 環境：`~/.cargo/registry`（2026-11-11 時点で 1.1GB）と Rust ツールチェーン。他プロジェクトで Rust を使っていないか確かめてから
- ブランチ：ローカルと origin の `sn-extension-mac-legacypatch-multi`、blues-sync の `sn-extension-win-legacypatch-verify`・`sn-extension-win-stub-sn_legacy_patch`
- 残す：`src/genUpdUrl.ts`（`update_check` の URL 差し替え用で、パッチ生成ツールとは別機能）

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
