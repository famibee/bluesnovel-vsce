/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// 各タブ共通の部品。ストアには触れず、props で受け渡しする

import type {ComponentChildren, TargetedInputEvent} from 'preact';
import {useState} from 'preact/hooks';
import type {T_VALIDATOR} from './validate';

export const Row = ({tight, children}: {tight?: boolean, children: ComponentChildren}) =>
	<div class={tight ?'stg-row stg-row-tight' :'stg-row'}>{children}</div>;

export const Full = ({children}: {children: ComponentChildren}) =>
	<div class="stg-full">{children}</div>;

export const Section = ({children}: {children: string}) =>
	<Full><h5 class="stg-h">{children}</h5></Full>;


type T_TEXT_PROPS = {
	id			: string;
	label		: string;
	value		: string;
	placeholder?: string;
	type?		: 'text' | 'url';
	validate?	: T_VALIDATOR;
	full?		: boolean;
	after?		: {label: string, disabled: boolean, onClick: ()=> void};
	/** 真の値を保持するのは呼び出し側（常に送信する＝合否に関係なく即時反映） */
	onCommit	: (v: string)=> void;
};
// 文字列項目：検証に落ちても onCommit は常に呼ぶ（テンプレ既定値のままでも保存できる必要がある）
export function TextField({id, label, value, placeholder, type = 'text', validate, full, after, onCommit}: T_TEXT_PROPS) {
	const err = validate?.(value) ?? '';
	const onInput = (e: TargetedInputEvent<HTMLInputElement>)=> {onCommit(e.currentTarget.value)};
	const cls = err ?'stg-input is-invalid' :'stg-input';
	const input = type === 'url'
		? <input id={id} type="url" value={value} placeholder={placeholder} class={cls} onInput={onInput}/>
		: <input id={id} type="text" value={value} placeholder={placeholder} class={cls} onInput={onInput}/>;
	return <div class={full ?'stg-full' :'stg-field'}>
		<label for={id} class="stg-label">{label}</label>
		{after
			? <div class="stg-input-group">
				{input}
				<button type="button" class="stg-btn" disabled={after.disabled} onClick={after.onClick}>{after.label}</button>
			</div>
			: input}
		{err && <div class="stg-invalid-feedback">{err}</div>}
	</div>;
}


type T_NUM_PROPS = {
	id		: string;
	label	: string;
	value	: number;
	validate?: T_VALIDATOR;
	/** 検証を通ったときだけ呼ばれる（空欄・小数は本体へ送らない） */
	onCommit: (v: number)=> void;
};
// 数値項目：入力中の文字列は部品側で保持。検証を通ったときだけ onCommit(Number) を呼ぶ
export function NumField({id, label, value, validate, onCommit}: T_NUM_PROPS) {
	const [str, setStr] = useState(()=> String(value));
	const err = validate?.(str) ?? '';
	const onInput = (e: TargetedInputEvent<HTMLInputElement>)=> {
		const v = e.currentTarget.value;
		setStr(v);
		if (! validate?.(v)) onCommit(Number(v));
	};
	return <div class="stg-field">
		<label for={id} class="stg-label">{label}</label>
		<input id={id} type="number" value={str} class={err ?'stg-input is-invalid' :'stg-input'} onInput={onInput}/>
		{err && <div class="stg-invalid-feedback">{err}</div>}
	</div>;
}


type T_CHK_PROPS = {
	id		: string;
	label	: string;
	checked	: boolean;
	disabled?: boolean;
	onChange: (v: boolean)=> void;
};
export function CheckField({id, label, checked, disabled, onChange}: T_CHK_PROPS) {
	return <div class="stg-check">
		<input id={id} type="checkbox" checked={checked} disabled={disabled}
			class="stg-checkbox"
			onChange={e=> {onChange(e.currentTarget.checked)}}/>
		<label for={id} class="stg-check-label">{label}</label>
	</div>;
}


type T_RNG_PROPS = {
	id		: string;
	label	: string;
	value	: number | undefined;
	max		: number;
	min		: number;
	step	: number;
	disabled?: boolean;
	/** ドラッグ中（onInput） */
	onInput	: (v: number)=> void;
	/** 離したとき（onChange） */
	onChange?: (v: number)=> void;
};
export const getLeftRangeBadge = (value = 0, max = 0, min = 0)=> {
	const val = (value - min) *100 /(max - min);
	const pos = 10 -val *0.2;
	return `calc(${String(val)}% + (${String(pos)}px))`;
};
export function RangeField({id, label, value, max, min, step, disabled, onInput, onChange}: T_RNG_PROPS) {
	return <div class="stg-field">
		<div class="stg-range-wrap">
			<div class="stg-range-badge" style={{left: getLeftRangeBadge(value, max, min)}}>
				{value !== undefined && <span>{value}</span>}
			</div>
			<label for={id} class="stg-label">{label}</label>
			<input id={id} type="range" value={value ?? min} max={max} min={min} step={step}
				disabled={disabled} class="stg-range"
				onInput={e=> {onInput(Number(e.currentTarget.value))}}
				onChange={onChange ?e=> {onChange(Number(e.currentTarget.value))} :undefined}/>
		</div>
	</div>;
}


export const fmtByte = (n: number)=> `${n.toLocaleString('ja-JP')} byte`;
export const fmtRatio = (a: number, b: number)=> (a / b).toLocaleString('ja-JP');
