// @flow
import React from 'react'

import LogMonitor from './DevToolsLogMonitor'
import DockMonitor from './DevToolsDockMonitor'

let createDevTools

if (__DEV__) {
	({createDevTools} = require('redux-devtools'))
}

export const HOTKEY_TOGGLE_DEVTOOLS_DEFAULT = 'ctrl-h'
export const HOTKEY_CHANGE_DEVTOOLS_POSITION_DEFAULT = 'ctrl-q'

type TParams = {
	children?: React$Element<*>,
	defaultIsVisible: boolean,
	toggleVisibilityKey: string,
	changePositionKey: string,
	changeMonitorKey?: string,
	fluid: boolean,
	defaultSize: number,
	defaultPosition: 'left' | 'right',
}

type TDevTools = ReactClass<*> & {instrument: () => void}

export function devToolsFactory ({
	children,
	defaultIsVisible = false,
	toggleVisibilityKey = HOTKEY_TOGGLE_DEVTOOLS_DEFAULT,
	changePositionKey = HOTKEY_CHANGE_DEVTOOLS_POSITION_DEFAULT,
	changeMonitorKey,
	fluid = true,
	defaultSize = 0.25,
	defaultPosition = 'right',
 }: TParams = {}): ?TDevTools {
	return __DEV__ && DockMonitor
		? createDevTools(
			<DockMonitor
				defaultIsVisible={defaultIsVisible}
				toggleVisibilityKey={toggleVisibilityKey}
				changePositionKey={changePositionKey}
				changeMonitorKey={changeMonitorKey}
				fluid={fluid}
				defaultSize={defaultSize}
				defaultPosition={defaultPosition}
			>
				{children || (LogMonitor ? <LogMonitor /> : null)}
			</DockMonitor>,
		)
		: null
}

export default devToolsFactory()
