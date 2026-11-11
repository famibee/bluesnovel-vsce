/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {useStg} from './store';
import {CheckField, fmtByte, fmtRatio, Row} from './parts';

export function StgSndOpt() {
	const oWss = useStg(s=> s.oWss);
	const hDisabled = useStg(s=> s.hDisabled);
	const setWss = useStg(s=> s.setWss);
	const oOptSnd = useStg(s=> s.oOptSnd);

	const aSize = Object.entries(oOptSnd.hSize)
		.map(([nm, v], key)=> ({key, nm, id: `acdMC${nm.replaceAll('.', '_')}`, ...v}));

	return <Row>
		<div class="stg-field">
			<CheckField id="cnv.mat.snd" label="mp3・wav をコーデック変換"
				checked={oWss['cnv.mat.snd']} disabled={hDisabled['cnv.mat.snd']}
				onChange={v=> {setWss('cnv.mat.snd', v)}}/>
		</div>

		<div class="stg-field">
			<label class="stg-label" for="cnv.mat.snd.codec">音声コーデック</label>
			<select id="cnv.mat.snd.codec" class="stg-select"
				value={oWss['cnv.mat.snd.codec']}
				onChange={e=> {setWss('cnv.mat.snd.codec', e.currentTarget.value)}}
			>
				<option value="opus">(.m4a) Opus</option>
				<option value="aac">(.aac) Advanced Audio Coding</option>
				<option value="ogg">(.ogg) Vorbis</option>
			</select>
		</div>

		{oOptSnd.sum.baseSize > 0 && <div class="stg-field">
			<table class="stg-table"><thead><tr>
				<th>元音声サイズ合計</th>
				<th>変換後</th>
				<th>削減率</th>
			</tr></thead><tbody>
			<tr>
				<td class="num">{fmtByte(oOptSnd.sum.baseSize)}</td>
				<td class="num">{fmtByte(oOptSnd.sum.optSize)}</td>
				<td>{fmtRatio(oOptSnd.sum.optSize, oOptSnd.sum.baseSize)}</td>
			</tr>
			</tbody></table>
		</div>}

		{oOptSnd.sum.baseSize > 0 && <div class="stg-full stg-table-scroll">
			<table class="stg-table"><thead><tr>
				<th>ファイル名</th>
				<th>元音声サイズ</th>
				<th>変換後</th>
				<th>削減率</th>
			</tr></thead><tbody>
			{aSize.map(e=> <tr key={e.key} id={e.id}>
				<td>{e.nm}</td>
				<td class="num">{fmtByte(e.baseSize)}</td>
				<td class="num">{fmtByte(e.optSize)}</td>
				<td>{fmtRatio(e.optSize, e.baseSize)}</td>
			</tr>)}
			</tbody></table>
		</div>}
	</Row>;
}
