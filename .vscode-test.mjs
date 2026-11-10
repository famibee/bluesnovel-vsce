/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2025 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// 統合テストの設定（@vscode/test-cli）。`bun run test:int` から使う。
//
// 公式が新規拡張機能に推奨するランナー。VSCode の入手・起動・Mocha の面倒を見る。
// 以前は test/int/runTests.ts で同じことを自作していた（src/docs/testing.md）。
//
// ⚠️ package.json の devDependencies にある @vscode/test-electron は自前の
// import が無いが消さないこと。@vscode/test-cli が実行時に内部で要求する
// （useInstallation.fromPath 指定時も含む。2026-11-10、消して bun run test:int が
// 「Error: Can't resolve '@vscode/test-electron'」で落ちることを確認した）
//
// TS 側の準備（フィクスチャ生成・実 VSCode の指定・リポジトリ外の user-data-dir・
// フォーカス対策）は test/prep.ts が持つ。ここはそれを配置するだけ

import {defineConfig} from '@vscode/test-cli';
import {prepare, prepareMulti} from './test/prep.mjs';

const {ws, fromPath, launchArgs} = prepare();
const multi = prepareMulti();

const mocha = {
	// ⚠️ **@vscode/test-cli の既定は `tdd`**（`suite`/`test`）。
	// そのままだと `it is not defined` で落ちる
	ui		: 'bdd',
	// ファイル監視のデバウンス（500ms＋300ms）を跨いで待つので、
	// 既定の 2 秒ではまったく足りない。実規模の計測ケースは 1 本で 40 秒ほど
	timeout	: 180_000,
	slow	: 30_000,
};

export default defineConfig([
	{
		label		: 'single',
		files		: 'test/int/suite.js',	// build.ts が esbuild で出す
		workspaceFolder	: ws,
		launchArgs, mocha,
		useInstallation	: fromPath ?{fromPath} :undefined,
	},
	{
		// src/docs/file-watch.md (A)：プロジェクト2つ。`workspaceFolder` は
		// **フォルダでも .code-workspace でもよい**
		label		: 'multi',
		files		: 'test/int/multi.js',
		workspaceFolder	: multi,
		launchArgs, mocha,
		useInstallation	: fromPath ?{fromPath} :undefined,
	},
]);
