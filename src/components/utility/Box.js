// @flow
import type {TColor, TTheme} from 'core/config/themes/types'
import PropTypes from 'prop-types'
import React from 'react'
import withTheme from './withTheme'

	/*
	Box is the basic UI primitive for all universal themed UI components.
		Box - Container
		Box - Header
		Box - Text
		Box - Text - Heading
		Box - Text - TextInput
		etc.

	For an inspiration.
		https://github.com/react-native-community/react-native-elements
		http://jxnblk.com/rebass
		https://vuetifyjs.com
		https://github.com/airyland/vux
		https://material-ui.com
		What else?

	TODO:
		- transform: https://microsoft.github.io/reactxp/docs/styles.html
		- maybe, handle View in Text https://github.com/Microsoft/reactxp/blob/762abbe7450501fc6b1088d55ef5539dd51ff223/src/web/utils/restyleForInlineText.tsx
		*/

// If a number, then it's multiplied by theme typography rhythm.
type TMaybeRhythm = number | string

export type TBoxProps = {
	as?: string | ((props: Object) => React.Element<*>), // eslint-disable-line flowtype/no-weak-types
	isReactNative?: boolean,
	style?: Object,  // eslint-disable-line flowtype/no-weak-types

	margin?: TMaybeRhythm,
	marginHorizontal?: TMaybeRhythm,
	marginVertical?: TMaybeRhythm,
	marginBottom?: TMaybeRhythm,
	marginLeft?: TMaybeRhythm,
	marginRight?: TMaybeRhythm,
	marginTop?: TMaybeRhythm,

	padding?: TMaybeRhythm,
	paddingHorizontal?: TMaybeRhythm,
	paddingVertical?: TMaybeRhythm,
	paddingBottom?: TMaybeRhythm,
	paddingLeft?: TMaybeRhythm,
	paddingRight?: TMaybeRhythm,
	paddingTop?: TMaybeRhythm,

	bottom?: TMaybeRhythm,
	height?: TMaybeRhythm,
	left?: TMaybeRhythm,
	maxHeight?: TMaybeRhythm,
	maxWidth?: TMaybeRhythm,
	minHeight?: TMaybeRhythm,
	minWidth?: TMaybeRhythm,
	right?: TMaybeRhythm,
	top?: TMaybeRhythm,
	width?: TMaybeRhythm,

	// Flexbox. Only what's compatible with React Native.
	// github.com/facebook/react-native/blob/master/Libraries/StyleSheet/LayoutPropTypes.js
	alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
	alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
	flex?: number,
	flexBasis?: number | string,
	flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
	flexGrow?: number,
	flexShrink?: number,
	flexWrap?: 'wrap' | 'nowrap',
	justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around',

	backgroundColor?: TColor,
	opacity?: number,
	overflow?: 'visible' | 'hidden' | 'scroll',
	position?: 'absolute' | 'relative',
	zIndex?: number,

	borderStyle?: 'solid' | 'dotted' | 'dashed',

	borderWidth?: number,
	borderBottomWidth?: number,
	borderLeftWidth?: number,
	borderRightWidth?: number,
	borderTopWidth?: number,

	borderRadius?: number,
	borderBottomLeftRadius?: number,
	borderBottomRightRadius?: number,
	borderTopLeftRadius?: number,
	borderTopRightRadius?: number,

	borderColor?: TColor,
	borderBottomColor?: TColor,
	borderLeftColor?: TColor,
	borderRightColor?: TColor,
	borderTopColor?: TColor,
}

type TBoxContent = {
	renderer: any, // TODO: Type it.
	theme: TTheme,
}

// Emulate React Native to ensure the same styles for all platforms.
// https://facebook.github.io/yoga
// https://github.com/Microsoft/reactxp
// https://github.com/necolas/react-native-web
const reactNativeEmulationForBrowsers = {
	display: 'flex',
	flexDirection: 'column',
	position: 'relative',
}

const reduce = (props: TBoxProps, getValue) =>
	Object.keys(props).reduce((style, prop) => {
		const value = props[prop]
		if (value === undefined) {
			return style
		}
		return {
			...style,
			[prop]: getValue(value),
		}
	}, {})

const maybeRhythm = (rhythm, props) =>
	reduce(props, (value) => (typeof value === 'number' ? rhythm(value) : value))

const justValue = (props) => reduce(props, (value) => value)

// https://facebook.github.io/react-native/releases/0.44/docs/layout-props.html#flex
// https://github.com/necolas/react-native-web expandStyle-test.js
const restrictedFlex = (
	flex,
	flexBasis = 'auto',
	flexShrink = 1,
	isReactNative,
) => {
	if (flex === undefined) {
		return null
	}
	if (flex < 1) {
		throw new Error('Not implemented yet')
	}
	return isReactNative ? {flex} : {flexBasis, flexGrow: flex, flexShrink}
}

// Color any type, because Flow can't infere props for some reason.
const themeColor = (colors: any, props) =>
	reduce(props, (value) => colors[value])

// Try to ensure vertical and horizontal rhythm.
const tryToEnsureRhythmViaPaddingCompensation = (style) =>
	['Bottom', 'Left', 'Right', 'Top'].reduce((style, prop) => {
		const borderXWidth = style[`border${prop}Width`]
		const paddingProp = `padding${prop}`
		const paddingX = style[paddingProp]
		const canCompute =
			typeof borderXWidth === 'number' && typeof paddingX === 'number'
		if (!canCompute) {
			return style
		}
		const compensatedPaddingX = paddingX - borderXWidth
		if (compensatedPaddingX < 0) {
			return style
		}
		return {...style, [paddingProp]: compensatedPaddingX}
	}, style)

const Box = (props: TBoxProps, {renderer, theme}: TBoxContent) => {
	const {
		as,
		isReactNative,
		style,

		margin,
		marginHorizontal = margin,
		marginVertical = margin,
		marginBottom = marginVertical,
		marginLeft = marginHorizontal,
		marginRight = marginHorizontal,
		marginTop = marginVertical,

		padding,
		paddingHorizontal = padding,
		paddingVertical = padding,
		paddingBottom = paddingVertical,
		paddingLeft = paddingHorizontal,
		paddingRight = paddingHorizontal,
		paddingTop = paddingVertical,

		bottom,
		height,
		left,
		maxHeight,
		maxWidth,
		minHeight,
		minWidth,
		right,
		top,
		width,

		alignItems,
		alignSelf,
		flex,
		flexBasis,
		flexDirection,
		flexGrow,
		flexShrink,
		flexWrap,
		justifyContent,
		backgroundColor,
		opacity,
		overflow,
		position,
		zIndex,
		borderStyle,

		borderWidth,
		borderBottomWidth = borderWidth,
		borderLeftWidth = borderWidth,
		borderRightWidth = borderWidth,
		borderTopWidth = borderWidth,

		borderRadius,
		borderBottomLeftRadius = borderRadius,
		borderBottomRightRadius = borderRadius,
		borderTopLeftRadius = borderRadius,
		borderTopRightRadius = borderRadius,

		borderColor,
		borderBottomColor = borderColor,
		borderLeftColor = borderColor,
		borderRightColor = borderColor,
		borderTopColor = borderColor,

		...restProps
	} = props

	const boxStyle = {
		...(isReactNative ? null : reactNativeEmulationForBrowsers),
		...maybeRhythm(theme.typography.rhythm, {
			marginBottom,
			marginLeft,
			marginRight,
			marginTop,

			paddingBottom,
			paddingLeft,
			paddingRight,
			paddingTop,

			bottom,
			height,
			left,
			maxHeight,
			maxWidth,
			minHeight,
			minWidth,
			right,
			top,
			width,
		}),
		...justValue({
			alignItems,
			alignSelf,
			flexBasis,
			flexDirection,
			flexGrow,
			flexShrink,
			flexWrap,
			justifyContent,
			opacity,
			overflow,
			position,
			zIndex,
			borderStyle,
			borderBottomWidth,
			borderLeftWidth,
			borderRightWidth,
			borderTopWidth,
			borderBottomLeftRadius,
			borderBottomRightRadius,
			borderTopLeftRadius,
			borderTopRightRadius,
		}),
		...restrictedFlex(flex, flexBasis, flexShrink, isReactNative),
		...themeColor(theme.colors, {
			backgroundColor,
			borderBottomColor,
			borderLeftColor,
			borderRightColor,
			borderTopColor,
		}),
		...style,
	}

	const rhythmBoxStyle = tryToEnsureRhythmViaPaddingCompensation(boxStyle)

	const className = renderer.renderRule(() => rhythmBoxStyle)
	return React.createElement(as || 'div', {...restProps, className})
}

Box.contextTypes = {
	renderer: PropTypes.object,
}

withTheme(Box)

export default Box
