/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {openURL, copyTxt} from './bridge';
import {useStg} from './store';
import {CheckField, Row, Section} from './parts';

// T_CFG.debug はすべて必須の真偽値なので、この並びで固定（本体の型と合わせて変える）
// .tsx では `<const>` 記法が JSX と衝突して構文エラーになるため `as const` のまま
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const A_DEBUG_KEY = ['devtool', 'dumpHtm', 'token', 'tag', 'putCh', 'debugLog', 'baseTx', 'masume', 'variable'] as const;
const DEF_DEBUG = {
	devtool: false, dumpHtm: false, token: false, tag: false, putCh: false,
	debugLog: false, baseTx: false, masume: false, variable: false,
};

export function StgDebug() {
	const oCfg = useStg(s=> s.oCfg);
	const patchCfg = useStg(s=> s.patchCfg);
	const debug = oCfg.debug ?? DEF_DEBUG;

	return <Row>
		<Section>暗号化しないフォルダ</Section>
		{Object.keys(oCfg.code ?? {}).map(nm=> <CheckField
			key={nm} id={`code.${nm}`} label={nm}
			checked={oCfg.code?.[nm] ?? false}
			onChange={v=> {patchCfg({code: {[nm]: v}})}}
		/>)}

		<Section>デバッグスイッチ</Section>
		{A_DEBUG_KEY.map(nm=> <CheckField
			key={nm} id={`debug.${nm}`} label={nm}
			checked={debug[nm]}
			onChange={v=> {patchCfg({debug: {...debug, [nm]: v}})}}
		/>)}

		<Section>セーブデータ保存先を開く</Section>
		<div class="stg-field">
			<label class="stg-label" for="open.dev.save_path">参考資料：開発者向け情報</label>
			<div class="stg-input-group">
				<span class="stg-label">【セーブデータの保存場所】</span>
				<button type="button" id="open.dev.save_path" class="stg-btn"
					onClick={()=> {openURL('https://famibee.github.io/SKYNovel/dev.html#save_path')}}>Open</button>
			</div>
		</div>
		<div class="stg-field">
			<label class="stg-label">ブラウザ版</label>
			<span class="stg-label">ブラウザのローカルストレージに保存されます</span>
		</div>
		<div class="stg-field">
			<label class="stg-label" for="copy.folder_save_app">アプリ版（通常実行）</label>
			<div class="stg-input-group">
				<span class="stg-label">手動で開いて下さい</span>
				<button type="button" id="copy.folder_save_app" class="stg-btn"
					onClick={()=> {copyTxt('copy.folder_save_app')}}>Copy Path</button>
			</div>
		</div>
		<div class="stg-field">
			<label class="stg-label" for="open.folder_save_dbg">アプリ版（デバッグ実行）</label>
			<div class="stg-input-group">
				<span class="stg-label">.vscode/storage/</span>
				<button type="button" id="open.folder_save_dbg" class="stg-btn"
					onClick={()=> {openURL('ws-folder:///.vscode/storage/')}}>Open</button>
			</div>
		</div>
	</Row>;
}
