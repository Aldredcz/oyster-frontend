// @flow
import type {TColor, TTheme} from 'core/config/themes/types'
import PropTypes from 'prop-types'
import React from 'react'

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
type TBorderStyle = 'solid' | 'dotted' | 'dashed'

export type TProps = {
	as?: string | ((props: Object) => React.Element<*>),
	style?: (theme: TTheme, style: Object) => Object,
	getRef?: (el: HTMLElement) => any,
	asBoxBasedComponent?: boolean,

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
	display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'none',
	block?: boolean,

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
	position?: 'absolute' | 'relative' | 'fixed' | 'static' | 'sticky',
	zIndex?: number,

	borderStyle?: TBorderStyle,
	borderBottomStyle?: TBorderStyle,
	borderLeftStyle?: TBorderStyle,
	borderRightStyle?: TBorderStyle,
	borderTopStyle?: TBorderStyle,

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

	cursor?: 'default' | 'pointer' | 'not-allowed',
}

type TBoxContent = {
	renderer: any, // TODO: Type it.
	theme: TTheme,
}

const reduceObject = (props: TProps, getValue) =>
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

const maybeRhythm = (props) =>
	reduceObject(props, (value) => (typeof value === 'number' ? `${value}rem` : value)) // TODO

const justValue = (props) => reduceObject(props, (value) => value)

const restrictedFlex = (
	flex,
	flexBasis = 'auto',
	flexShrink,
) => {
	if (flex === undefined) {
		return null
	}
	if (flex < 1) {
		throw new Error('Not implemented yet')
	}
	return {display: 'flex', flexBasis, flexGrow: flex, flexShrink}
}

// Color any type, because Flow can't infere props for some reason.
const themeColor = (colors: any, props) =>
	reduceObject(props, (value: any) => (value in colors) ? colors[value] : value)

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

const Box = (props: TProps, {renderer, theme}: TBoxContent) => {
	const {
		as,
		style,
		getRef,
		asBoxBasedComponent,

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
		display,
		block,

		alignItems,
		alignSelf,
		flex,
		flexBasis,
		flexDirection,
		flexGrow,
		flexShrink = 0,
		flexWrap,
		justifyContent,
		backgroundColor,
		opacity,
		overflow,
		position,
		zIndex = ((position === 'absolute' || position === 'fixed') ? 1 : undefined),

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

		borderColor = (borderWidth && 'neutral') || undefined,
		borderBottomColor = borderColor || (borderBottomWidth && 'neutral') || undefined,
		borderLeftColor = borderColor || (borderLeftWidth && 'neutral') || undefined,
		borderRightColor = borderColor || (borderRightWidth && 'neutral') || undefined,
		borderTopColor = borderColor || (borderTopWidth && 'neutral') || undefined,

		borderStyle = (borderWidth && 'solid') || undefined,
		borderBottomStyle = borderStyle || (borderBottomWidth && 'solid') || undefined,
		borderLeftStyle = borderStyle || (borderLeftWidth && 'solid') || undefined,
		borderRightStyle = borderStyle || (borderRightWidth && 'solid') || undefined,
		borderTopStyle = borderStyle || (borderTopWidth && 'solid') || undefined,

		cursor,

		...restProps
	} = props

	if (typeof as === 'function' && asBoxBasedComponent) {
		const newProps = {...props}
		delete newProps.as
		delete newProps.asBoxBasedComponent

		return React.createElement(as, {
			...newProps,
		})
	}

	const boxStyle = {
		...maybeRhythm({
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
			display,
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
			borderBottomStyle,
			borderLeftStyle,
			borderRightStyle,
			borderTopStyle,
			borderBottomWidth,
			borderLeftWidth,
			borderRightWidth,
			borderTopWidth,
			borderBottomLeftRadius,
			borderBottomRightRadius,
			borderTopLeftRadius,
			borderTopRightRadius,
			cursor,
		}),
		...restrictedFlex(flex, flexBasis, flexShrink),
		...themeColor(theme.colors, {
			backgroundColor,
			borderBottomColor,
			borderLeftColor,
			borderRightColor,
			borderTopColor,
		}),
	}

	block && (boxStyle.display = 'block')

	const rhythmBoxStyle = tryToEnsureRhythmViaPaddingCompensation(boxStyle)

	const className = renderer.renderRule(() => ({
		...rhythmBoxStyle,
		...(style && style(theme, boxStyle)),
	}))
	return React.createElement(as || 'div', {
		...restProps,
		className,
		ref: getRef,
	})
}

Box.displayName = 'Box'
Box.contextTypes = {
	renderer: PropTypes.object,
}

export type TThemeContext = {theme: TTheme}

export const withTheme = (Component: ReactClass<mixed>) => {
	Component.contextTypes = {
		...Component.contextTypes,
		theme: PropTypes.object,
	}
}

withTheme(Box)

export default Box
