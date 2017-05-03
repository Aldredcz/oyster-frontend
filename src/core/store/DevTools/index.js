import React from 'react'

import LogMonitor from './DevToolsLogMonitor'
import DockMonitor from './DevToolsDockMonitor'

let createDevTools

if (__DEV__) {
	({createDevTools} = require('redux-devtools'))
}

export const HOTKEY_TOGGLE_DEVTOOLS_DEFAULT = 'ctrl-h'
export const HOTKEY_CHANGE_DEVTOOLS_POSITION_DEFAULT = 'ctrl-q'

export function devToolsFactory ({
	children,
	defaultIsVisible = false,
	toggleVisibilityKey = HOTKEY_TOGGLE_DEVTOOLS_DEFAULT,
	changePositionKey = HOTKEY_CHANGE_DEVTOOLS_POSITION_DEFAULT,
	changeMonitorKey,
	fluid = true,
	defaultSize = 0.25,
	defaultPosition = 'right',
 } = {}) {
	return __DEV__
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
				{children || <LogMonitor />}
			</DockMonitor>,
		)
		: null
}

export default devToolsFactory()
