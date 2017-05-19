// @flow
import type {TTheme} from './types'
import typography from './typography'

export const visualTheme: TTheme = {
	typography: typography({
		fontSize: 16,
		fontSizeScale: 'step5', // perfect fourth, modularscale.com
		lineHeight: 24,
	}),
	colors: {
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
			medium: 720,
			big: 960,
			bigger: 1140,
		},
	},
	text: {
		bold: 600,
		fontFamily: 'Verdana, sans-serif',
	},
	block: {
		marginBottom: 1,
		maxWidth: 21,
	},
	button: {
		borderRadius: 2,
	},
	heading: {
		fontFamily: 'Verdana, sans-serif',
		marginBottom: 1,
	},
	paragraph: {
		marginBottom: 1,
	},
}
