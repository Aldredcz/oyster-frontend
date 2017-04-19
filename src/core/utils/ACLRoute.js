// @flow
import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {getAuthorizationData} from 'core/authorization'

type TProps = $PropertyType<Route, 'props'>

export default class ACLRoute extends React.Component<void, TProps, void> {
	render () {
		const {render, component: Component, ...rest} = this.props

		const isAuthenticated = Boolean(getAuthorizationData().token)

		return (
			<Route
				{...rest}
				render={(props) => (
					isAuthenticated
						? Component
							? <Component {...props}/>
							: render
								? render(props)
								: <noscript />
						: (
							<Redirect
								to={`/login?unauthorized&redirectTo=${encodeURIComponent(props.location.pathname + props.location.search)}`}
							/>
						)
				)}
			/>
		)
	}
}
