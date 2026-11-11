/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2026 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

// 設定画面のエントリ。tools/build.ts が views/setting.js・views/setting.css へ出力し、
// views/setting.htm が読む

import {render} from 'preact';
import {App} from './App';
import './setting.css';

const elApp = document.getElementById('app');
if (elApp) render(<App/>, elApp);
