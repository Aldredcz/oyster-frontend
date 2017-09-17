import {TTheme} from './types'

const REM = 16

export const visualTheme: TTheme = {
	typography: {
		sizes: {
			'30': {
				fontSize: `${30 / REM}rem`,
				lineHeight: `${39 / REM}rem`,
				letterSpacing: .20,
			},
			'17': {
				fontSize: `${17 / REM}rem`,
				lineHeight: `${20 / REM}rem`,
				letterSpacing: .40,
			},
			'13': {
				fontSize: `${13 / REM}rem`,
				lineHeight: `${16 / REM}rem`,
				letterSpacing: .40,
			},
			'9': {
				fontSize: `${9 / REM}rem`,
				lineHeight: `${15 / REM}rem`,
				letterSpacing: .40,
			},
			'8': {
				fontSize: `${8 / REM}rem`,
				lineHeight: `${11 / REM}rem`,
				letterSpacing: .40,
			},
		},
		fontFamily: 'Montserrat, sans-serif',
	},
	colors: {
		white: '#fff',
		neutralLight: '#f5f5f5',
		neutral: '#bebebe',
		neutralDark: '#6e6e6e',
		red: '#ff325a',
		yellow: '#ffd200',
		green: '#00ebc8',
		greenDark: '#00d2af',
		blue: '#00a5ff',
		blueDark: '#009beb',
		inherit: 'inherit',
		transparent: 'transparent',
	},
	states: {
		active: {
			darken: 0.2,
			opacity: 0.7,
		},
		disabled: {
			opacity: 0.5,
		},
	},
	container: {
		maxWidths: {
			small: 540,
			medium: 740,
			big: 960,
			bigger: 1140,
		},
	},
	text: {
		bold: 400,
	},
	block: {
		marginBottom: 1,
		maxWidth: 21,
	},
	button: {
		borderRadius: 4,
	},
	heading: {
		marginBottom: 1,
	},
	paragraph: {
		marginBottom: 1,
	},
}
