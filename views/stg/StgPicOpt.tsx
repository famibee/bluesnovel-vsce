/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {useState} from 'preact/hooks';
import {sendPicQ, sendPicQDef, useStg} from './store';
import {CheckField, fmtByte, fmtRatio, getLeftRangeBadge, RangeField, Row} from './parts';
import type {T_OPTPIC_FILE} from '../../src/types';

export function StgPicOpt() {
	const oWss = useStg(s=> s.oWss);
	const hDisabled = useStg(s=> s.hDisabled);
	const setWss = useStg(s=> s.setWss);
	const oOptPic = useStg(s=> s.oOptPic);
	const setPicQ = useStg(s=> s.setPicQ);
	const picRev = useStg(s=> s.picRev);
	const [openNm, setOpenNm] = useState<string | undefined>(undefined);

	const aSize = Object.entries(oOptPic.hSize)
		.map(([nm, v], key)=> ({key, nm, id: `acdMC${nm.replaceAll('.', '_')}`, ...v}));

	return <Row>
		<div class="stg-field">
			<CheckField id="cnv.mat.pic" label="jpg・png を WebP に変換"
				checked={oWss['cnv.mat.pic']} disabled={hDisabled['cnv.mat.pic']}
				onChange={v=> {setWss('cnv.mat.pic', v)}}/>
		</div>

		<RangeField id="cnv.mat.webp_quality" label="基本の変換画質"
			value={oWss['cnv.mat.webp_quality']} max={100} min={5} step={5}
			disabled={hDisabled['cnv.mat.pic']}
			onInput={v=> {setWss('cnv.mat.webp_quality', v)}}
			onChange={v=> {sendPicQDef(v)}}/>

		{oOptPic.sum.baseSize > 0 && <div class="stg-field">
			<table class="stg-table"><thead><tr>
				<th>元画像サイズ合計</th>
				<th>webp変換後</th>
				<th>削減率</th>
			</tr></thead><tbody>
			<tr>
				<td class="num">{fmtByte(oOptPic.sum.baseSize)}</td>
				<td class="num">{fmtByte(oOptPic.sum.webpSize)}</td>
				<td>{fmtRatio(oOptPic.sum.webpSize, oOptPic.sum.baseSize)}</td>
			</tr>
			</tbody></table>
		</div>}

		{oOptPic.sum.baseSize > 0 && <div class="stg-full stg-table-scroll">
			<table id="tblMatCnv" class="stg-table"><thead><tr>
				<th>ファイル名</th>
				<th>変換画質</th>
				<th>元画像サイズ</th>
				<th>webp変換後</th>
				<th>削減率</th>
			</tr></thead><tbody>
			{aSize.map(e=> <>
				<tr key={e.key} id={e.id} class="stg-table-row-clickable"
					onClick={()=> {setOpenNm(openNm === e.nm ?undefined :e.nm)}}
				>
					<td>{e.nm}</td>
					<td>{e.webp_q ?? `${String(oWss['cnv.mat.webp_quality'])} (基本の値)`}</td>
					<td class="num">{fmtByte(e.baseSize)}</td>
					<td class="num">{fmtByte(e.webpSize)}</td>
					<td>{fmtRatio(e.webpSize, e.baseSize)}</td>
				</tr>
				{openNm === e.nm && <tr class="stg-table-detail">
					<td colSpan={5}><PicDetail e={e} nm={e.nm}
						defQ={oWss['cnv.mat.webp_quality']}
						disabled={hDisabled['cnv.mat.pic']}
						sumPicCmpWebP={oOptPic.sum.pathPicCmpWebP} sumPicCmpBase={oOptPic.sum.pathPicCmpBase}
						picRev={picRev} setPicQ={setPicQ}/></td>
				</tr>}
			</>)}
			</tbody></table>
		</div>}
	</Row>;
}


function PicDetail({e, nm, defQ, disabled, sumPicCmpWebP, sumPicCmpBase, picRev, setPicQ}: {
	e			: T_OPTPIC_FILE;
	nm			: string;
	defQ		: number;
	disabled	: boolean;
	sumPicCmpWebP: string;
	sumPicCmpBase: string;
	picRev		: number;
	setPicQ		: (nm: string, webp_q: number | undefined)=> void;
}) {
	const hasOwn = e.webp_q !== undefined;
	const updPic = (src: string)=> `${src}?${String(picRev)}`;

	return <Row tight>
		<CheckField id={`cnv.mat.pic.${nm}`} label="画質を個別設定"
			checked={hasOwn} disabled={disabled}
			onChange={no_def=> {
				const webp_q = no_def ?defQ :undefined;
				setPicQ(nm, webp_q);
				sendPicQ(nm, no_def, webp_q ?? defQ);
			}}/>

		<div class="stg-field">
			<div class="stg-range-wrap">
				<div class="stg-range-badge" style={{left: getLeftRangeBadge(e.webp_q, 100, 5)}}>
					{hasOwn && <span>{e.webp_q}</span>}
				</div>
				<input type="range" max={100} min={5} step={5}
					value={e.webp_q ?? defQ}
					disabled={! hasOwn || disabled}
					class="stg-range"
					onInput={ev=> {setPicQ(nm, Number(ev.currentTarget.value))}}
					onChange={ev=> {sendPicQ(nm, true, Number(ev.currentTarget.value))}}/>
			</div>
		</div>

		<div class="stg-full stg-cmp-wrap">
			<img-comparison-slider>
				<img loading="lazy" slot="first" src={updPic(`${sumPicCmpWebP}${e.fld_nm}.webp`)}/>
				<img loading="lazy" slot="second" src={updPic(`${sumPicCmpBase}${e.fld_nm}.${e.ext}`)}/>
				<svg slot="handle" width="100" xmlns="http://www.w3.org/2000/svg" viewBox="-8 -3 16 6">
					<path stroke="#fff" d="M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2" stroke-width="2" fill="#ffa658" vector-effect="non-scaling-stroke"></path>
				</svg>
			</img-comparison-slider>
			<button type="button" class="stg-btn stg-cmp-label stg-cmp-label-l" disabled>WebP</button>
			<button type="button" class="stg-btn stg-cmp-label stg-cmp-label-r" disabled>{e.ext}</button>
		</div>
	</Row>;
}
