/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {useStg} from './store';
import {CheckField, getLeftRangeBadge, Row} from './parts';
import {vTempRequired} from './validate';

export function StgTemp() {
	const aTemp = useStg(s=> s.aTemp);
	const errTemp = useStg(s=> s.errTemp);
	const setTemp = useStg(s=> s.setTemp);

	if (errTemp) return <div class="stg-alert-danger">{errTemp}</div>;

	return <Row>
		{aTemp.map((t, i)=> {
			if (t.type === 'chk') return <CheckField key={i} id={t.id} label={t.lbl}
				checked={t.bol ?? false}
				onChange={bol=> {setTemp(i, {bol})}}/>;

			if (t.type === 'rng') return <div key={i} class="stg-field">
				<div class="stg-range-wrap">
					<div class="stg-range-badge" style={{left: getLeftRangeBadge(t.num, t.max, t.min)}}>
						<span>{t.num}</span>
					</div>
					<label for={t.id} class="stg-label">{t.lbl}</label>
					<input type="range" id={t.id} value={t.num} max={t.max} min={t.min} step={t.step}
						class="stg-range"
						onInput={e=> {setTemp(i, {num: Number(e.currentTarget.value)})}}/>
				</div>
			</div>;

			const err = vTempRequired(t.val);
			const cls = err ?'stg-input is-invalid' :'stg-input';
			const onInput = (e: {currentTarget: HTMLInputElement})=> {setTemp(i, {val: e.currentTarget.value})};
			return <div key={i} class="stg-field">
				<label for={t.id} class="stg-label">{t.lbl}</label>
				{t.type === 'num'
					? <input type="number" id={t.id} value={t.val} placeholder={t.lbl} class={cls} onInput={onInput}/>
					: <input type="text" id={t.id} value={t.val} placeholder={t.lbl} class={cls} onInput={onInput}/>}
				{err && <div class="stg-invalid-feedback">{err}</div>}
			</div>;
		})}
	</Row>;
}
