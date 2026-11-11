/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// DOM に触らない純関数の検証群。文言は Vue 版（yup）のまま

export type T_VALIDATOR = (v: string) => string;	// 空文字＝合格

export const compose = (...aFnc: T_VALIDATOR[]): T_VALIDATOR => v=> {
	for (const fnc of aFnc) {
		const err = fnc(v);
		if (err) return err;
	}
	return '';
};

export const vRequired = (mes = '必須入力項目です'): T_VALIDATOR => v=> v ?'' :mes;

export const vNotOneOf = (aNg: string[], mes = 'あなたの作品情報に変更してください'): T_VALIDATOR =>
	v=> aNg.includes(v) ?mes :'';

export const vMatches = (re: RegExp, mes: string): T_VALIDATOR => v=> re.test(v) ?'' :mes;

export const vUrl = (mes = 'URL形式ではありません'): T_VALIDATOR => v=> {
	try {new URL(v); return ''}
	catch {return mes}
};

export const vUrlOrMail = (mes = 'URL（https:〜）かメールアドレスを指定してください'): T_VALIDATOR => v=> {
	if (/^https?:\/\//.test(v)) {
		try {new URL(v); return ''}
		catch {return mes}
	}
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ?'' :mes;
};

export const vInteger = (mes = '整数にして下さい'): T_VALIDATOR => v=>
	Number.isInteger(Number(v)) ?'' :mes;

export const vMin = (min: number, mes: string): T_VALIDATOR => v=> Number(v) >= min ?'' :mes;

// セマンティックバージョニング 2.0.0 https://semver.org/lang/ja/
// regex101: https://regex101.com/r/vkijKf/1/
export const RE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// ⚠️ Vue 版の不具合は写さない：`/#\d{6}/` は非アンカーで a〜f を弾いていた
export const vBgColor: T_VALIDATOR = v=> /^#[0-9a-fA-F]{6}$/.test(v) ?'' :'#000000 形式ではありません';

// Temp タブ（Vue 版は yup のローカライズを通さず常にこの英文）
export const vTempRequired: T_VALIDATOR = v=> v ?'' :'This field is required';
