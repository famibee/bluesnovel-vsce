/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// 拡張機能本体（src/PrjSetting.ts）との通信口。
// 画面側のコードが acquireVsCodeApi() に触れるのはこのファイルだけ

import type {T_E2V, T_V2E} from '../../src/types';

const vscode = 'acquireVsCodeApi' in window ?acquireVsCodeApi() :undefined;
// false なのは setting.htm をブラウザで直接開いたとき（見た目の確認用）
export const isVSCode = vscode !== undefined;

// unknown ではなく T_V2E にすることで、呼び出し側で型注入しなくても検査される
export const cmd2Ex: (o: T_V2E)=> void = vscode
	? o=> vscode.postMessage(o)
	: o=> {console.log('cmd2Ex:%o', o)};
export const openURL = (url: string)=> {cmd2Ex({cmd: 'openURL', url})};
export const copyTxt = (id: string)=> {cmd2Ex({cmd: 'copyTxt', id})};


/**
 * 本体からの受信を fnc へ流し、準備完了（'?'）を本体へ知らせる。
 * 本体は '?' を受けて初期値（'!'）ほかを送ってくるので、**必ず受け口を張ってから**送る
 */
export function listen(fnc: (d: T_E2V)=> void) {
	window.addEventListener('message', e=> {
		if (! e.isTrusted) {
			cmd2Ex({cmd: 'warn', mes: '設定画面 isTrusted=false'});
			return;
		}
		fnc(<T_E2V>e.data);
	});
	cmd2Ex({cmd: '?'});
}


// webview が隠れて作り直されても残したい状態（いまは選択中のタブだけ）
export type T_WV_STATE = {
	active_tab	: string;
};
export const getWvState = (): T_WV_STATE=>
	<T_WV_STATE | undefined>vscode?.getState() ?? {active_tab: 'basic'};
export const setWvState = (o: T_WV_STATE)=> {vscode?.setState(o)};
