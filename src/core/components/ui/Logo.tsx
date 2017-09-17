import React from 'react'
import Ico, {TProps as TIcoProps} from './Ico'

type TExcludedProps = {
	type: any,
}
// export type TProps = $Diff<TIcoProps, TExcludedProps>
export type TProps = TIcoProps | any // we need Diff<>

export default class Logo extends React.Component<TProps> {
	render () {
		const {color = 'blue', ...restProps} = this.props

		return (
			<Ico {...restProps} color={color} type='logo' />
		)
	}
}
