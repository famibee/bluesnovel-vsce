/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// `.vscode-test/` に積もった古い版の掃除（bun run clean:vtest）。
//
// 背景：test/prep.ts の A_VSC（既にある VSCode を優先して使う一覧）が
// 2026-11-10 まで mac 版の実行バイナリ名を間違えており（'Electron' が正しくは
// 'Code'）、常に @vscode/test-cli の自動ダウンロードへフォールバックしていた。
// そのため版が上がるたびに `.vscode-test/vscode-darwin-X.Y.Z/` が増え続け、
// 5版・約4.7GB まで積もっていた（修正後は原則ダウンロードされない）。
//
// 直接は消さず、`rimraf` 同様に対象と容量を先に出す（確認なしで一気に消す
// ことはしない。手元の環境にしか無いダウンロード物なので取り返しはつくが、
// 実行中のテストが使っているフォルダを誤って消さないよう一応立ち止まる）

import {readdirSync, statSync} from 'node:fs';
import {rimraf} from 'rimraf';

const DIR = '.vscode-test';
const REG_VER = /^vscode-\w+-(\d+)\.(\d+)\.(\d+)$/;

if (! existsOk(DIR)) {
	console.log(`${DIR}/ は無い（掃除するものなし）`);
	process.exit(0);
}

function existsOk(p: string) {
	try {return statSync(p).isDirectory()} catch {return false}
}

const aEnt = readdirSync(DIR, {withFileTypes: true})
	.filter(d=> d.isDirectory() && REG_VER.test(d.name))
	.map(d=> d.name);

if (aEnt.length <= 1) {
	console.log(`${DIR}/ に古い版は無い（${String(aEnt.length)}件）`);
	process.exit(0);
}

const verNum = (nm: string)=> {
	const m = REG_VER.exec(nm);
	if (! m) return 0;
	return Number(m[1]) *1_000_000 + Number(m[2]) *1_000 + Number(m[3]);
};
aEnt.sort((a, b)=> verNum(b) -verNum(a));
const [keep, ...drop] = aEnt;

console.log(`残す（最新）：${String(keep)}`);
console.log(`消す（${String(drop.length)}件）：`);
for (const nm of drop) console.log(`  - ${DIR}/${nm}`);

const DRY = process.argv.includes('--dry');
if (DRY) {
	console.log('\n--dry なので実際には消さない。実行するには --dry を外す');
	process.exit(0);
}

for (const nm of drop) await rimraf(`${DIR}/${nm}`);
console.log('\n✓ 削除完了');
