// environment
declare var __DEV__: boolean

// from HTML file
declare var ENVIRONMENT: 'development' | 'production' | typeof undefined
declare var BUILD_HASH: string | typeof undefined
declare var TIMING_START: number
declare var NBSP: string

// webpack hot module reload
declare var module: {
	hot: {
		accept(path: string, callback: () => void): void,
	},
	require(path: string | number): void,
}

// webpack `require` API
interface webpackRequireExtras {
	(string): any
	resolveWeak(path: string): number | null,
}

declare var require: webpackRequireExtras


// override
declare var localStorage: Storage

// webpack
declare var __webpack_modules__: any // eslint-disable-line
declare var __webpack_require__: Function  // eslint-disable-line


declare module "*.svg" {
	const content: React.ComponentClass;
	export default content;
}

declare module "raw-loader!*" {
	const content: string;
	export default content;
}

declare type $TSFixMe = any
declare type $FixMe = any

