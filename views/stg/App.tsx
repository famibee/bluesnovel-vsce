/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import type {ComponentType} from 'preact';
import {useStg} from './store';
import {StgBasic} from './StgBasic';
import {StgApp} from './StgApp';
import {StgTemp} from './StgTemp';
import {StgDebug} from './StgDebug';
import {StgPicOpt} from './StgPicOpt';
import {StgSndOpt} from './StgSndOpt';
import {StgPkg} from './StgPkg';

// ⚠️ id は test/ui/runUI.ts が `#nav-{id}-tab`・`#nav-{id}` で参照し、
// vscode.setState() にも保存される。変えるならテストと合わせて
const A_TAB: {id: string; nm: string; cmp?: ComponentType}[] = [
	{id: 'basic',	nm: '基本情報',		cmp: StgBasic},
	{id: 'app',		nm: 'アプリ',		cmp: StgApp},
	{id: 'temp',	nm: 'テンプレ',		cmp: StgTemp},
	{id: 'debug',	nm: 'デバッグ',		cmp: StgDebug},
	{id: 'PicOpt',	nm: '画像最適化',	cmp: StgPicOpt},
	{id: 'sndopt',	nm: '音声最適化',	cmp: StgSndOpt},
	{id: 'pkg',		nm: 'パッケージ',	cmp: StgPkg},
];

export function App() {
	const activeTab = useStg(s=> s.activeTab);
	const setTab = useStg(s=> s.setTab);

	return <>
		<nav class="stg-tabs" role="tablist">
			{A_TAB.map(({id, nm})=> <button
				key={id} type="button" role="tab"
				id={`nav-${id}-tab`} aria-controls={`nav-${id}`}
				aria-selected={id === activeTab}
				class={id === activeTab ?'active' :undefined}
				onClick={()=> {setTab(id)}}
			>{nm}</button>)}
		</nav>
		{A_TAB.map(({id, cmp: Cmp})=> <div
			key={id} role="tabpanel"
			id={`nav-${id}`} aria-labelledby={`nav-${id}-tab`}
			class={id === activeTab ?'stg-pane active' :'stg-pane'}
		>
			{/* 中身を作るのは選択中のタブだけ（状態はストアにあるので失われない） */}
			{id === activeTab && Cmp ?<Cmp/> :null}
		</div>)}
	</>;
}
