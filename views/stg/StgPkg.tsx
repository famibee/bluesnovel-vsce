/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {openURL} from './bridge';
import {selectIcon, useStg} from './store';
import {CheckField, fmtByte, fmtRatio, Row, Section} from './parts';

// パスが空のあいだのダミーアイコン（白地に音符っぽい四角）
const SRC_ICON_DEF = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMjBjMCAxNzYuNzIgMTQzLjI4IDMyMCAzMjAgMzIwczMyMC0xNDMuMjggMzIwLTMyMC0xNDMuMjgtMzIwLTMyMC0zMjAtMzIwIDE0My4yOC0zMjAgMzIwem0yMDAgMTAwdi0yMDBoODB2MjAwem0xNjAgMHYtMjAwaDgwdjIwMHoiLz48L2RlZnM+PHBhdGggZD0ibTE0Ny40OSAxODAuNDFoMzUyLjR2MjgyLjY5aC0zNTIuNHoiIGZpbGw9IiNmZmYiLz48dXNlIGZpbGw9IiMyZTJlMmUiIHhsaW5rOmhyZWY9IiNhIi8+PHVzZSBmaWxsPSJub25lIiB4bGluazpocmVmPSIjYSIvPjwvc3ZnPg==';

export function StgPkg() {
	const oWss = useStg(s=> s.oWss);
	const hDisabled = useStg(s=> s.hDisabled);
	const setWss = useStg(s=> s.setWss);
	const aCnvFont = useStg(s=> s.aCnvFont);
	const pathIcon = useStg(s=> s.pathIcon);
	const errIcon = useStg(s=> s.errIcon);
	const fld_src = useStg(s=> s.fld_src);
	const picRev = useStg(s=> s.picRev);

	const srcIcon = pathIcon ?`${pathIcon}?${String(picRev)}` :SRC_ICON_DEF;

	return <Row>
		<div class="stg-field">
			<label class="stg-label" for="open.readme.txt">readme.txtを開く</label>
			<div class="stg-input-group">
				<span class="stg-label">【build/include/readme.txt】</span>
				<button type="button" id="open.readme.txt" class="stg-btn"
					onClick={()=> {openURL('ws-file:///build/include/readme.txt')}}>Open</button>
			</div>
		</div>
		<div class="stg-field">
			<label class="stg-label">フォントサイズ最適化</label>
			<CheckField id="cnv.font.subset" label="必要最小限にする"
				checked={oWss['cnv.font.subset']} disabled={hDisabled['cnv.font.subset']}
				onChange={v=> {setWss('cnv.font.subset', v)}}/>
		</div>

		<Section>フォント情報</Section>
		<div class="stg-full stg-table-scroll">
			<table class="stg-table"><thead><tr>
				<th>Filename</th>
				<th>元ファイルの場所</th>
				<th>Size（元ファイル）</th>
				<th>Size（出力結果）</th>
				<th>削減率</th>
				<th>ログ</th>
			</tr></thead><tbody>
			{aCnvFont.map(e=> <>
				<tr key={e.nm}>
					<td>{e.nm}</td>
					<td>{e.mes}</td>
					<td class="num">{fmtByte(e.iSize)}</td>
					<td class="num">{fmtByte(e.oSize)}</td>
					<td>{fmtRatio(e.oSize, e.iSize)}</td>
					<td>
						<button type="button" class="stg-btn"
							onClick={()=> {openURL(`ws-file:///${fld_src}/font/subset_font_${e.nm}.txt`)}}>Open</button>
					</td>
				</tr>
				{e.err && <tr class="stg-table-row-err">
					<td/>
					<td colSpan={5}>{e.err}</td>
				</tr>}
			</>)}
			</tbody></table>
		</div>

		<Section>アプリアイコン</Section>
		<div class="stg-field">
			<img loading="lazy" src={srcIcon} onClick={selectIcon} class="stg-icon-pic"/>
		</div>
		<div class="stg-field">
			<label class="stg-label">画像から自動作成</label>
			<ul class="stg-radio-list">
				<li class="stg-radio">
					<input type="radio" class="stg-radio-input" name="rgCnvIconShape" id="rgCnvIconShape0"
						checked={oWss['cnv.icon.shape'] === 0}
						onChange={()=> {setWss('cnv.icon.shape', 0)}}/>
					<label class="stg-radio-label" for="rgCnvIconShape0">加工しない</label>
				</li>
				<li class="stg-radio">
					<input type="radio" class="stg-radio-input" name="rgCnvIconShape" id="rgCnvIconShape1"
						checked={oWss['cnv.icon.shape'] === 1}
						onChange={()=> {setWss('cnv.icon.shape', 1)}}/>
					<label class="stg-radio-label" for="rgCnvIconShape1">丸に</label>
				</li>
				<li class="stg-radio">
					<input type="radio" class="stg-radio-input" name="rgCnvIconShape" id="rgCnvIconShape2"
						checked={oWss['cnv.icon.shape'] === 2}
						onChange={()=> {setWss('cnv.icon.shape', 2)}}/>
					<label class="stg-radio-label" for="rgCnvIconShape2">角丸に</label>
				</li>
			</ul>
			<div class="stg-input-group" style={{marginTop: '.5rem'}}>
				<button type="button" class="stg-btn" onClick={selectIcon}>ファイルを選択</button>
				{errIcon && <span class="stg-invalid-feedback">{errIcon}</span>}
			</div>
		</div>
	</Row>;
}
