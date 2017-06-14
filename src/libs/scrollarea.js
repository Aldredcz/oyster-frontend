// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import lineHeight from 'line-height'
import throttle from 'lodash/throttle'

type TProps = $Shape<{
	onMove: (dX: number, dY: number, ev: Event) => any,
	speed: number,
	touchEvents: boolean,
	scrollEvents: boolean,
	dragEvents: boolean,
	children: any,
}>

export default class ScrollArea extends React.Component<*, TProps, void> {
	static defaultProps = {
		touchEvents: true,
		scrollEvents: true,
		dragEvents: true,
		speed: 1,
	}

	touchEventPreviousValues = {
		clientX: 0,
		clientY: 0,
	}

	dragEventPreviousValues = {
		clientX: 0,
		clientY: 0,
	}

	contentEl: ?HTMLElement = null
	lineHeightPx: number = 16

	componentDidMount () {
		// eslint-disable-next-line react/no-find-dom-node
		this.lineHeightPx = lineHeight(ReactDOM.findDOMNode(this.contentEl))
	}

	handleDragStart = (ev: MouseEvent) => {
		const {clientX, clientY} = ev

		ev.preventDefault()
		ev.stopPropagation()

		this.dragEventPreviousValues = {
			clientX,
			clientY,
		}
		document.addEventListener('mousemove', this.handleDragMove)
		document.addEventListener('mouseup', this.handleDragEnd)
	}

	handleDragMove = throttle((ev: MouseEvent) => {
		const {clientX, clientY} = ev

		const deltaX = clientX - this.dragEventPreviousValues.clientX
		const deltaY = clientY - this.dragEventPreviousValues.clientY

		this.props.onMove(deltaX, deltaY, ev)

		this.dragEventPreviousValues = {
			clientX,
			clientY,
		}
	}, 16, {trailing: false})

	handleDragEnd = () => {
		document.removeEventListener('mousemove', this.handleDragMove)
		document.removeEventListener('mouseup', this.handleDragEnd)
	}

	handleTouchStart = (ev: TouchEvent) => {
		const {touches} = ev
		if (touches.length === 1) {
			const {clientX, clientY} = touches[0]
			this.touchEventPreviousValues = {
				clientY,
				clientX,
			}
		}
	}

	handleTouchMove = throttle((ev: TouchEvent) => {
		ev.preventDefault()
		ev.stopPropagation()

		const {touches} = ev
		if (touches.length === 1) {
			const {clientX, clientY} = touches[0]

			const deltaY = this.touchEventPreviousValues.clientY - clientY
			const deltaX = this.touchEventPreviousValues.clientX - clientX

			this.touchEventPreviousValues = {
				clientY,
				clientX,
			}

			this.props.onMove(deltaX, deltaY, ev)
		}
	}, 16, {trailing: false})

	handleWheel = (ev: WheelEvent) => {
		let deltaY = ev.deltaY
		let deltaX = ev.deltaX

		/*
		 * WheelEvent.deltaMode can differ between browsers and must be normalized
		 * e.deltaMode === 0: The delta values are specified in pixels
		 * e.deltaMode === 1: The delta values are specified in lines
		 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
		 */
		if (ev.deltaMode === 1) {
			deltaY = deltaY * this.lineHeightPx
			deltaX = deltaX * this.lineHeightPx
		}

		deltaY = deltaY * (this.props.speed || 1)
		deltaX = deltaX * (this.props.speed || 1)

		this.props.onMove(deltaX, deltaY, ev)
	}

	render () {
		const {touchEvents, scrollEvents, dragEvents, children} = this.props

		return (
			<div
				onWheel={scrollEvents && this.handleWheel}
			>
				<div
					draggable={dragEvents}
					ref={(x) => this.contentEl = x}
					onDragStart={dragEvents && this.handleDragStart}
					onTouchStart={touchEvents && this.handleTouchStart}
					onTouchMove={touchEvents && this.handleTouchMove}
				>
					{children}
				</div>
			</div>
		)
	}
}
