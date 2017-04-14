// @flow
import React from 'react'

// https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194

// getComponent is a function that returns a promise for a component
// It will not be called until the first mount

interface IGetComponent {
	(): Promise<ReactClass<any>> // http://stackoverflow.com/a/41861934
}
type TState = {
	Component: ?ReactClass<any>
}

export default function asyncComponent (getComponent: IGetComponent) {
	return class AsyncComponent extends React.Component<void, void, TState> {
		static Component: ?ReactClass<any>  = null;
		state = {Component: AsyncComponent.Component};

		componentWillMount () {
			if (!this.state.Component) {
				getComponent().then((Component) => {
					AsyncComponent.Component = Component
					this.setState({Component})
				})
			}
		}

		render () {
			const {Component} = this.state
			if (Component) {
				return <Component {...this.props} />
			}

			return null
		}
	}


}
