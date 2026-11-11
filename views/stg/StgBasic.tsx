/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {openURL} from './bridge';
import {useStg} from './store';
import {Full, Row, TextField} from './parts';
import {compose, vMatches, vNotOneOf, vRequired, vUrl, vUrlOrMail} from './validate';

const vSaveNs = compose(
	vRequired(),
	vMatches(/^[\w.]+$/, '英数字か[_.]のみです'),
	vNotOneOf(['hatsune', 'uc']),
);
const vTitle = compose(vRequired(), vNotOneOf(['初音館にて', '桜の樹の下には']));
const vCreator = compose(vRequired(), vNotOneOf(['ふぁみべぇ']));
const vCreUrl = compose(
	vRequired(),
	vNotOneOf(['https://twitter.com/famibee', 'https://twitter.com/ugainovel']),
	vUrlOrMail(),
);
const vPublisher = compose(vRequired(), vNotOneOf(['電子演劇部']));
const vPubUrl = compose(
	vRequired(), vUrl(),
	vNotOneOf(['https://famibee.blog.fc2.com/', 'https://ugainovel.blog.fc2.com/']),
);
const vDetail = compose(vRequired(), vNotOneOf([
	'江戸川乱歩「孤島の鬼」二次創作ノベルゲームサンプルです。',
	'梶井基次郎「桜の樹の下には」をノベルゲーム化したものです。',
]));

export function StgBasic() {
	const oCfg = useStg(s=> s.oCfg);
	const patchCfg = useStg(s=> s.patchCfg);
	const book = oCfg.book ?? {};

	return <Row>
		<TextField id="save_ns" label="プロジェクト名" value={oCfg.save_ns ?? ''}
			placeholder="com.fc2.blog.famibee 的な出版者ＵＲＬの逆順ドメイン推奨"
			validate={vSaveNs} onCommit={v=> {patchCfg({save_ns: v})}}/>
		<TextField id="book.title" label="作品タイトル名" value={book.title ?? ''}
			placeholder="（日本語名でＯＫ）"
			validate={vTitle} onCommit={v=> {patchCfg({book: {...book, title: v}})}}/>

		<TextField id="book.creator" label="著作者" value={book.creator ?? ''}
			placeholder="ペンネーム、ハンドル名など"
			validate={vCreator} onCommit={v=> {patchCfg({book: {...book, creator: v}})}}/>
		<TextField id="book.cre_url" label="連絡先URL・mail" value={book.cre_url ?? ''}
			placeholder="メアド、SNSなど"
			validate={vCreUrl} onCommit={v=> {patchCfg({book: {...book, cre_url: v}})}}
			after={{label: 'Open', disabled: Boolean(vCreUrl(book.cre_url ?? '')), onClick: ()=> {openURL(book.cre_url ?? '')}}}/>

		<TextField id="book.publisher" label="出版者" value={book.publisher ?? ''}
			placeholder="サークル名、団体名など"
			validate={vPublisher} onCommit={v=> {patchCfg({book: {...book, publisher: v}})}}/>
		<TextField id="book.pub_url" label="出版者URL" value={book.pub_url ?? ''}
			placeholder="ご自身の公式サイトなど" type="url"
			validate={vPubUrl} onCommit={v=> {patchCfg({book: {...book, pub_url: v}})}}
			after={{label: 'Open', disabled: Boolean(vPubUrl(book.pub_url ?? '')), onClick: ()=> {openURL(book.pub_url ?? '')}}}/>

		<Full>
			<div class="stg-field">
				<label class="stg-label" for="book.detail">内容：プロジェクトの説明</label>
				<textarea id="book.detail" placeholder="インストーラーに表示する内容説明"
					class={vDetail(book.detail ?? '') ?'stg-textarea is-invalid' :'stg-textarea'}
					value={book.detail ?? ''}
					onInput={e=> {patchCfg({book: {...book, detail: e.currentTarget.value}})}}
				/>
				{vDetail(book.detail ?? '') && <div class="stg-invalid-feedback">{vDetail(book.detail ?? '')}</div>}
			</div>
		</Full>
	</Row>;
}
