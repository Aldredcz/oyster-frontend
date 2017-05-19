// @flow

// Because { [color: Color]?: boolean } doesn't work, we have to define props.
export type TColorProps = {
	// Don't hesitate to add your own.
	primary?: boolean,
	success?: boolean,
	warning?: boolean,
	danger?: boolean,
	black?: boolean,
	white?: boolean,
	gray?: boolean,
}

export type TColor = $Keys<TColorProps>

export type TTheme = {|
	typography: {|
		fontSize: (number) => number,
		lineHeight: number,
		rhythm: (number) => number,
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
		fontFamily: string,
	|},
	block: {|
		marginBottom: number,
		maxWidth: number,
	|},
	button: {|
		borderRadius: number,
	|},
	heading: {|
		fontFamily: string,
		marginBottom: number,
	|},
	paragraph: {|
		marginBottom: number,
	|},
	// input: {| In case someone needs that.
	// |},
|}
