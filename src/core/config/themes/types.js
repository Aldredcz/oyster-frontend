// @flow

export type TColor =
	| 'inherit'
	| 'transparent'
	| 'white'
	| 'neutralLight'
	| 'neutral'
	| 'neutralDark'
	| 'red'
	| 'yellow'
	| 'green'
	| 'greenDark'
	| 'blue'
	| 'blueDark'


export type TTextSize = '30' | '17' | '13' | '9' | '8'

export type TTheme = {|
	typography: {|
		sizes: {
			[key: TTextSize]: {|
				fontSize: number | string,
				lineHeight: number | string,
				letterSpacing: number,
			|},
		},
		fontFamily: string,
	|},
	colors: {
		[color: TColor]: string,
	},
	states: {
		active: {|
			darken: number,
			opacity: number,
		|},
		disabled: {|
			opacity: number,
		|},
	},
	container: {|
		maxWidths: {|
			small: number,
			medium: number,
			big: number,
			bigger: number,
		|},
	|},
	text: {|
		bold: | 'normal'
			| 'bold'
			| 100
			| 200
			| 300
			| 400
			| 500
			| 600
			| 700
			| 800
			| 900,
	|},
	block: {|
		marginBottom: number,
		maxWidth: number,
	|},
	button: {|
		borderRadius: number,
	|},
	heading: {|
		marginBottom: number,
	|},
	paragraph: {|
		marginBottom: number,
	|},
	// input: {| In case someone needs that.
	// |},
|}
