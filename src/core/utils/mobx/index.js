// @flow

window.mobx = {}

// eslint-disable-next-line flowtype/no-weak-types
export function persistStateSingleton<T: Object> (store: T): T {
	let existingState
	const StoreClass = store.constructor

	if (window.mobx[StoreClass.name]) {
		existingState = window.mobx[StoreClass.name]
	}

	// TODO: add localStorage rehydration option
	if (existingState) {
		store = new StoreClass(existingState)
	}

	Object.defineProperty(store, 'resetStore', {
		value () {
			const newStore = new StoreClass()
			Object.assign(this, newStore)
			Object.keys(this).forEach((key) => {
				this[key] = newStore[key]
			})
		},
		enumerable: false,
	})

	window.mobx[StoreClass.name] = store
	return store
}


// PROBLEM: class name (for debug purpose
/*
export function enhanceStoreClass<T> (
	Class: T & Class<*>,
	{
		isSingleton = true,
	}: {
		isSingleton: boolean,
	} = {},
): $Supertype<T> {
	const name = Class.name
	class EnhancedStore extends Class {
		constructor (props) {
			if (isSingleton) {
				let finalProps = props
				if (window.mobx[name]) {
					finalProps = window.mobx[name]
				}

				// TODO: add localStorage rehydration option

				super(finalProps)

				window.mobx[name] = this
			} else {
				super(props)
			}
		}
	}

	return EnhancedStore
}
*/
