// img-comparison-slider（Web Component）を JSX で直接使うための型宣言
import type {JSX as PJSX} from 'preact';

declare module 'preact/jsx-runtime' {
	namespace JSX {
		// 既存の IntrinsicElements（interface）に宣言マージするため type にできない
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface IntrinsicElements {
			'img-comparison-slider': PJSX.HTMLAttributes<HTMLElement>;
		}
	}
}
