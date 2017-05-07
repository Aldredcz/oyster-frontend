// @noflow
import React from 'react'


/**
 * It is decorator pushing propertis from store to component props.
 *
 * @param definitions consists of:
 * - entityStore: store itself created by function createEntityStore
 * - id: exact value or function defines how to get entity id from props
 * - fields: fields you are interested in
 * - mapStateToProps: similar with Redux but this one adding 'loadingState' and 'updatingState'
 * - mapUpdateToProps: is function which argument is function for optimistic update. If update fails value is reverted
 * 			mapUpdateToProps: (update) => ({
 *  			updateName: (name) => update({name})
 *			})
 */
export function connectEntity (...definitions) {
	const emptyState = {
		entityState: {},
		loadingState: {},
		updatingState: {},
	}

	return function wrapWithConnect (WrappedComponent) {

		class Connect extends React.Component {
			state = {
				states: definitions.map(() => emptyState),
			}

			ids = []
			unsubscribes = []
			wrappedComponentInstance = null

			getWrappedInstance () {
				return this.wrappedComponentInstance
			}

			getId (id, props = this.props) {
				return ((typeof id === 'function') ? id(props) : id) || null
			}

			componentWillMount () {
				const initStates = []

				definitions.forEach(({entityStore, id}, i) => {
					this.ids[i] = this.getId(id)
					if (this.ids[i]) {
						initStates[i] = this.initConnect(i)
					} else {
						initStates[i] = emptyState
					}
				})

				this.setState({
					states: initStates,
				})
			}

			componentWillUnmount () {
				this.unsubscribes.forEach((unsubscribe) => {
					unsubscribe && unsubscribe()
				})
			}

			componentWillReceiveProps (nextProps) {
				const newStates = []

				this.ids.forEach((prevId, i) => {
					const {id} = definitions[i]

					this.ids[i] = this.getId(id, nextProps)

					if (this.ids[i] !== prevId) {
						this.unsubscribes[i] && this.unsubscribes[i]()
						this.unsubscribes[i] = null
						newStates[i] = this.initConnect(i) || emptyState
					} else {
						newStates[i] = prevId ? this.state.states[i] : emptyState
					}
				})

				this.setState({
					states: newStates,
				})
			}

			initConnect (i) {
				const {entityStore, fields} = definitions[i]

				if (this.ids[i]) {
					this.unsubscribes[i] = entityStore.subscribe(
						this.ids[i],
						fields,
						(...states) => this.setState((state) => {
							state.states[i] = this.getNewState(i, states)
						}),
					)
					entityStore.getEntity(this.ids[i], fields)

					return this.getNewState(i, entityStore.getState(this.ids[i], fields))
				}
			}

			getNewState = (i, [entityState, loadingState, updatingState]) => ({
				entityState: {
					...this.state.states[i].entityState,
					...entityState,
				},
				loadingState: {
					...this.state.states[i].loadingState,
					...loadingState,
				},
				updatingState: {
					...this.state.states[i].updatingState,
					...updatingState,
				},
			})

			render () {
				const {states} = this.state
				let mappedStatesToProps = {}
				let mappedUpdatesToProps = {}

				states.forEach(({entityState, loadingState, updatingState}, i) => {
					const {entityStore, mapStateToProps, mapUpdateToProps} = definitions[i]

					if (mapStateToProps) {
						mappedStatesToProps = {
							...mappedStatesToProps,
							...mapStateToProps(entityState, loadingState, updatingState),
						}
					}
					if (mapUpdateToProps) {
						mappedUpdatesToProps = {
							...mappedUpdatesToProps,
							...mapUpdateToProps(
								(state, params) => entityStore.updateEntity(this.ids[i], state, params),
							),
						}
					}
				})

				return (
					<WrappedComponent
						ref={(component) => this.wrappedComponentInstance = component}
						{...this.props}
						{...mappedStatesToProps}
						{...mappedUpdatesToProps}
					/>
				)
			}
		}

		return Connect
	}
}
