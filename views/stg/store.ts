/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// 設定画面の状態はすべてここに置く（タブを切り替えても消えないように、
// コンポーネントの外に持つ）。
//
// ⚠️ 約束事：**本体へ送るのは「利用者が操作したとき」だけ。**
//	- 操作（setXxx / patchCfg など）＝ ストア更新 ＋ 本体へ送信
//	- 受信（#recv）＝ ストア更新のみ。**送り返さない**
// 「ストアが変わったら送る」方式だと、本体から届いた値をそのまま送り返してしまう
// （Vue 時代はこれで prj.json が二度書かれ、本体側にエコー抑止フラグが必要だった）

import {create} from 'zustand';
import {DEF_CFG, DEF_CFG4TST, DEF_TEMP, DEF_TEMP4TST, DEF_WSS, creBJ_OPTPIC, creBJ_OPTPIC4TST, creOPTSND, creOPTSND4TST} from '../../src/types';
import type {T_A_CNVFONT, T_BJ_OPTPIC, T_CFG, T_E2V, T_E2V_NOTICE_COMPONENT, T_OPTSND, T_TEMP, T_WSS, TK_WSS} from '../../src/types';
import {cmd2Ex, getWvState, isVSCode, listen, setWvState} from './bridge';

// ブラウザで直接開いたとき用の見本データ
const CNVFONT4TST: T_A_CNVFONT = [
	{nm: 'KFhimajihoso', mes: 'OS（ユーザー別）へのインストール済みフォント', iSize: 10000, oSize: 3000, err: ''},
	{nm: 'ipamjm', mes: 'プロジェクト内（src(core)/font/ 下）', iSize: 20000, oSize: 4000, err: '変換失敗です。入力ファイル ipamjm.ttf が存在するか確認してください'},
];

// 本体が処理中のあいだ操作させないスイッチ
type TK_DISABLED = Exclude<T_E2V_NOTICE_COMPONENT['id'], 'cnv.mat.snd.codec'>;

type T_STG = {
	activeTab	: string;

	oCfg		: T_CFG;		// doc/prj/prj.json
	oWss		: T_WSS;		// workspaceState
	hDisabled	: {[id in TK_DISABLED]: boolean};

	aTemp		: T_TEMP[];		// doc/prj/*/setting.sn
	errTemp		: string;

	aCnvFont	: T_A_CNVFONT;
	oOptPic		: T_BJ_OPTPIC;
	oOptSnd		: T_OPTSND;
	picRev		: number;		// 画像 URL に付けるキャッシュ回避の番号。
								// **本体が画像を作り直したときだけ**進める
								// （描画のたびに変えると毎回取り直しになる）

	pathIcon	: string;		// 空なら未取得
	errIcon		: string;
	fld_src		: string;

	setTab		: (id: string)=> void;
	/** prj.json の一部を書き換える。渡した差分だけを本体へ送る */
	patchCfg	: (patch: T_CFG)=> void;
	setWss		: <K extends TK_WSS>(id: K, val: T_WSS[K])=> void;
	/** setting.sn の i 番目の値を書き換える */
	setTemp		: (i: number, patch: Partial<Pick<T_TEMP, 'val'|'num'|'bol'>>)=> void;
	/** 画像ごとの変換画質。undefined で「基本の値を使う」に戻す。送信は sendPicQ() */
	setPicQ		: (nm: string, webp_q: number | undefined)=> void;
};

const A_CFG_SEC = <const>['book', 'window', 'log', 'init', 'debug', 'code'];

export const useStg = create<T_STG>()((set, get)=> ({
	activeTab	: getWvState().active_tab,

	oCfg		: isVSCode ?DEF_CFG :DEF_CFG4TST,
	oWss		: {...DEF_WSS},
	hDisabled	: {
		'cnv.font.subset'	: false,
		'cnv.mat.pic'		: false,
		'cnv.mat.snd'		: false,
	},

	aTemp		: isVSCode ?DEF_TEMP :DEF_TEMP4TST,
	errTemp		: '',

	aCnvFont	: isVSCode ?[] :CNVFONT4TST,
	oOptPic		: isVSCode ?creBJ_OPTPIC() :creBJ_OPTPIC4TST(),
	oOptSnd		: isVSCode ?creOPTSND() :creOPTSND4TST(),
	picRev		: 0,

	pathIcon	: '',
	errIcon		: '',
	fld_src		: '',


	setTab: activeTab=> {
		set({activeTab});
		setWvState({active_tab: activeTab});
	},

	patchCfg: patch=> {
		const o = get().oCfg;
		const oCfg: T_CFG = {...o, ...patch};
		// 二段目は個別にマージ（本体の 'update.oCfg' と同じやり方）
		for (const k of A_CFG_SEC) {
			if (patch[k]) oCfg[k] = <never>{...o[k], ...patch[k]};
		}
		set({oCfg});
		cmd2Ex({cmd: 'update.oCfg', oCfg: patch});
	},

	setWss: (id, val)=> {
		const oWss = {...get().oWss, [id]: val};
		set({oWss});

		// 本体がどれかを処理中（確認ダイアログ・変換）なら送らない。
		// 本体は 'update.oWss' を直列化しておらず、重ねて送ると変換が並走する
		const {hDisabled} = get();
		if (Object.values(hDisabled).some(v=> v)) return;
		cmd2Ex({cmd: 'update.oWss', oWss});
	},

	setTemp: (i, patch)=> {
		const aTemp = get().aTemp.map((v, j)=> j === i ?{...v, ...patch} :v);
		set({aTemp});
		cmd2Ex({
			cmd	: 'update.aTemp',
			aRes: aTemp.map(({type, nm, val, num, bol})=> {switch (type) {
				case 'rng':	return {nm, val: String(num)};
				case 'chk':	return {nm, val: String(bol)};
				default:	return {nm, val};
			}}),
		});
	},

	setPicQ: (nm, webp_q)=> {
		const {oOptPic} = get();
		const {webp_q: _, ...f} = oOptPic.hSize[nm] ?? {};
		if (! ('fld_nm' in f)) return;	// 一覧に無い名前
		set({oOptPic: {...oOptPic, hSize: {
			...oOptPic.hSize,
			[nm]: webp_q === undefined ?f :{...f, webp_q},
		}}});
	},
}));


// 基本の変換画質を確定した（スライダーを離した）
export const sendPicQDef = (webp_q: number)=> {
	cmd2Ex({cmd: 'change.range.webp_q_def', webp_q});
};
// 画像ごとの変換画質を確定した。no_def=false は「基本の値を使う」
export const sendPicQ = (nm: string, no_def: boolean, webp_q: number)=> {
	cmd2Ex({cmd: 'change.range.webp_q', nm, no_def, webp_q});
};
export const selectIcon = ()=> {cmd2Ex({
	cmd			: 'selectFile',
	title		: 'アプリアイコン',
	openlabel	: '素材画像を選択',
	path		: 'build/icon.png',
})};


//MARK: 本体からの受信
function recv(d: T_E2V) {
	const {setState: set, getState: get} = useStg;
	switch (d.cmd) {
		case '!':
			set({
				oCfg	: d.oCfg,
				oWss	: d.oWss,
				pathIcon: d.pathIcon,
				fld_src	: d.fld_src,
				picRev	: Date.now(),
			});
			break;

		case 'update.oCfg':		set({oCfg: d.oCfg});	break;
		case 'update.cnvFont':	set({aCnvFont: d.aCnvFont});	break;
		case 'update.optPic':	set({oOptPic: d.oOptPic, picRev: Date.now()});	break;
		case 'update.optSnd':	set({oOptSnd: d.oOptSnd});	break;

		case 'update.aTemp':
			set({
				aTemp: d.aTemp.map(v=> {switch (v.type) {
					case 'rng':	return {...v, num: Number(v.val)};
					case 'chk':	return {...v, bol: v.val !== 'false'};
					default:	return v;
				}}),
				errTemp: d.err,
			});
			break;

		case 'notice.Component':{
			const {id, mode} = d;
			if (id === 'cnv.mat.snd.codec') break;

			const {hDisabled, oWss} = get();
			switch (mode) {
				case 'wait':	set({hDisabled: {...hDisabled, [id]: true}});	break;
				case 'comp':	set({hDisabled: {...hDisabled, [id]: false}});	break;
				case 'cancel':	// 確認ダイアログで断られた等。スイッチを元に戻す
					set({
						hDisabled	: {...hDisabled, [id]: false},
						oWss		: {...oWss, [id]: ! oWss[id]},
					});
					break;
			}
		}	break;

		case 'updpic':
			set({pathIcon: d.pathIcon, errIcon: d.err_mes, picRev: Date.now()});
			break;
	}
}
listen(recv);
