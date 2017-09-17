import React from 'react'
import {observer} from 'mobx-react'

type TEntityStore = {
	getEntity: (id: string) => Object,
}

export default function injectEntity (
	{
		entityStore,
		id,
		mapEntityToProps = (entity) => ({entity}),
	}: {
		entityStore: TEntityStore,
		id: string | ((Object) => string),
		mapEntityToProps?: (Object) => Object,
	},
) {
	return function wrapWithConnect <T extends React.ComponentClass<any>>(WrappedComponent: T): T {
		function resolveId (id, props) {
			return ((typeof id === 'function') ? id(props) : id) || null
		}

		@observer
		class Connect extends React.Component<any, any> {
			state = {
				entity: null,
			}

			wrappedComponentInstance = null

			componentWillMount () {
				const idResolved = resolveId(id, this.props)

				if (idResolved) {
					this.setState({
						entity: entityStore.getEntity(idResolved),
					})
				}
			}

			componentWillReceiveProps (nextProps) {
				const idCurrent = resolveId(id, this.props)
				const idNew = resolveId(id, nextProps)

				if (idNew && idNew !== idCurrent) {
					this.setState({
						entity: entityStore.getEntity(idNew),
					})
				}
			}

			getWrappedInstance () {
				return this.wrappedComponentInstance
			}

			render () {
				const propsInjected = this.state.entity ? mapEntityToProps(this.state.entity) : {}

				return (
					<WrappedComponent
						ref={(component) => this.wrappedComponentInstance = component}
						{...propsInjected}
						{...this.props}
					/>
				)
			}
		}

		return Connect as any
	}
}
