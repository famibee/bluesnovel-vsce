/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {useStg} from './store';
import {NumField, Row, Section, TextField} from './parts';
import {compose, RE_SEMVER, vBgColor, vInteger, vMatches, vMin, vRequired} from './validate';

const MES_REQ = '必須の項目です';
const vWidth	= compose(vRequired(MES_REQ), vInteger(), vMin(300, '最小値 300 以上にして下さい'));
const vHeight	= compose(vRequired(MES_REQ), vInteger(), vMin(300, '最小値 300 以上にして下さい'));
const vVersion	= compose(vRequired(MES_REQ), vMatches(RE_SEMVER, '1.0.0 など セマンティックバージョニング記述して下さい'));
const vMaxLen	= compose(vRequired(MES_REQ), vInteger(), vMin(10, '最小値 10 以上にして下さい'));
const vTagch	= compose(vRequired(MES_REQ), vInteger(), vMin(1, '最小値 1 以上にして下さい'));
const vAutoWait	= compose(vRequired(MES_REQ), vInteger(), vMin(1, '最小値 1 以上にして下さい'));

// oCfg.*? が未着（ブラウザ直開き・初期化前）のときの穴埋め。DEF_CFG と値を揃える
const DEF_WINDOW = {width: 300, height: 300};
const DEF_LOG = {max_len: 1024};
const DEF_INIT = {bg_color: '#000000', tagch_msecwait: 10, auto_msecpagewait: 3500, escape: ''};

export function StgApp() {
	const oCfg = useStg(s=> s.oCfg);
	const patchCfg = useStg(s=> s.patchCfg);
	const book = oCfg.book ?? {};
	const o_window = oCfg.window ?? DEF_WINDOW;
	const log = oCfg.log ?? DEF_LOG;
	const init = oCfg.init ?? DEF_INIT;

	return <Row>
		<NumField id="book.width" label="アプリの横幅" value={o_window.width} validate={vWidth}
			onCommit={v=> {patchCfg({window: {...o_window, width: v}})}}/>
		<NumField id="book.height" label="アプリの縦幅" value={o_window.height} validate={vHeight}
			onCommit={v=> {patchCfg({window: {...o_window, height: v}})}}/>

		<TextField id="book.version" label="バージョン" value={book.version ?? ''}
			placeholder="1.0.0 など" validate={vVersion}
			onCommit={v=> {patchCfg({book: {...book, version: v}})}}/>

		<NumField id="book.max_len" label="ログ保存長" value={log.max_len} validate={vMaxLen}
			onCommit={v=> {patchCfg({log: {max_len: v}})}}/>

		<Section>初期値</Section>
		<NumField id="book.tagch_msecwait" label="文字表示待ち時間(ms)" value={init.tagch_msecwait} validate={vTagch}
			onCommit={v=> {patchCfg({init: {...init, tagch_msecwait: v}})}}/>
		<NumField id="book.auto_msecpagewait" label="自動読み時文字表示待ち(ms)" value={init.auto_msecpagewait} validate={vAutoWait}
			onCommit={v=> {patchCfg({init: {...init, auto_msecpagewait: v}})}}/>

		<TextField id="book.escape" label="エスケープ文字" value={init.escape} placeholder="半角記号推奨"
			onCommit={v=> {patchCfg({init: {...init, escape: v.replaceAll(/[ &()*;[\]]/g, '')}})}}/>

		<div class="stg-field">
			<label class="stg-label" for="book.bg_color">背景色</label>
			<input id="book.bg_color" type="color" class="stg-input"
				value={vBgColor(init.bg_color) ?'#000000' :init.bg_color}
				onInput={e=> {patchCfg({init: {...init, bg_color: e.currentTarget.value}})}}/>
		</div>
	</Row>;
}
