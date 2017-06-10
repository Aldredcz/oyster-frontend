// @flow
import React from 'react'
import Ico from './Ico'
import type {TProps as TIcoProps} from './Ico'

type TExcludedProps = {|
	type: any,
|}
export type TProps = $Diff<TIcoProps, TExcludedProps>

export default class Logo extends React.Component<void, TProps, void> {
	render () {
		//$FlowFixMe - $Diff is ruining flow here big time
		const {color = 'blue', ...restProps} = this.props

		return (
			<Ico {...restProps} color={color} type='logo' />
		)
	}
}
