/**
 * Function creating your own resource store.
 *
 * @param fetch - function defines how to get the data. If it is null you have to set data manually by function updateEntity.
 * @param update - function defines how to update data
 * @param cacheExpiration
 * @param stateReviver
 * @param scope
 *
 * @returns The store, what is map of functions: {{getEntity, updateEntity, getState, subscribe}} - like API for working with resource store.
 */

type TEntityId = string
type TEntityFields = Array<any>
type TAllEntities = 'all'
type TEntityIds = Array<TEntityId> | TAllEntities
type TObject = {[key: string]: any}
type TPromiseResolvable<T> = Promise<T> & {resolve?: any}
type TGetEntityResult = {[key: string]: Promise<any>}

type TParams = {
	readonly fetch?: (entityId: TEntityId, fields: TEntityFields) => Promise<any>,
	readonly fetchAll?: (entityIds: TEntityIds, fields: TEntityFields) => Promise<any>,
	readonly create?: (entityState: any) => Promise<any>,
	readonly update?: (entityState: any, newState: any) => Promise<any>,
	readonly remove?: (entityId: TEntityId) => Promise<any>,
	readonly cacheExpiration?: number,
	readonly stateReviver?: (entityState: any) => TObject,
	readonly scope?: () => any,
}

export function createEntityStore (
	{
		fetch: APIFetch,
		fetchAll: APIFetchAll,
		create: APICreate,
		update: APIUpdate,
		remove: APIRemove,
		cacheExpiration: APICacheExpiration = Infinity,
		stateReviver: APIStateReviver,
		scope: APIScope = () => '',
	}: TParams = {},
) {
	let cache = {} // eslint-disable-line
	const listeners = {}
	const fetchPromises = {}
	const updatingState = {}

	function getObjectForEntity (object, entityId): TObject {
		const currentScope = APIScope()

		if (!object[currentScope]) {
			object[currentScope] = {}
		}
		if (!object[currentScope][entityId]) {
			object[currentScope][entityId] = {}
		}
		if (object === cache && !object[currentScope][entityId].id) {
			object[currentScope][entityId].id = { // always valid with predefined value
				get timestamp () {
					return Date.now()
				},
				value: entityId,
			}
		}

		return object[currentScope][entityId]
	}

	function getFetchPromisesForField (entityId: TEntityId, field: string): Array<TPromiseResolvable<any>> {
		const entityFetchPromises = getObjectForEntity(fetchPromises, entityId)
		if (!entityFetchPromises[field]) {
			entityFetchPromises[field] = []
		}

		return entityFetchPromises[field]

	}

	function getStateFromCache (entityId, fields) {
		const entityCache = getObjectForEntity(cache, entityId)


		return fields
			? fields.reduce(
				(result, field) => (
					result[field] = entityCache[field] && entityCache[field].value,
						result
				),
				{},
			)
			: entityCache
	}

	function getLoadingStateForFields (entityId, fields) {
		return fields.reduce(
			(result, field) => {
				result[field] = Boolean(getFetchPromisesForField(entityId, field).length)

				return result
			},
			{},
		)
	}

	function getUpdatingStateForFields (entityId, fields) {
		const entityUpdatingState = getObjectForEntity(updatingState, entityId)

		return fields
			? fields.reduce(
				(result, field) => (
					result[field] = Boolean(entityUpdatingState[field]),
						result
				),
				{},
			)
			: entityUpdatingState
	}

	function updateCache (entityId, state) {
		const affectedFields = Object.keys(state)

		const entityCache = getObjectForEntity(cache, entityId)
		affectedFields.forEach((field) => {
			entityCache[field] = {
				timestamp: Date.now(),
				value: state[field],
			}
		})
	}

	function notifyListeners (entityId, affectedFields) {
		const entityListeners = getObjectForEntity(listeners, entityId)
		const affectedListeners = new Map()

		affectedFields.forEach((field) => {
			if (entityListeners[field]) {
				entityListeners[field].forEach((listener) => {
					if (!affectedListeners.has(listener)) {
						affectedListeners.set(listener, {fields: []})
					}
					const affectedListener = affectedListeners.get(listener)
					if (affectedListener) {
						affectedListener.fields.push(field)
					}
				})
			}
		})

		affectedListeners.forEach(({fields: listenerFields}, listener) => {
			const state = getStateFromCache(entityId, listenerFields)

			listener(
				APIStateReviver ? APIStateReviver(state) : state,
				getLoadingStateForFields(entityId, listenerFields),
				getUpdatingStateForFields(entityId, listenerFields),
			)
		})
	}


	const updateEntity = Object.assign(
		(
			entityId: TEntityId,
			newState: any,
			{
				updateOnServer = true,
				__INTERNAL_DO_NOT_USE = false,
			}: {
				updateOnServer?: boolean,
				__INTERNAL_DO_NOT_USE?: boolean,
			} = {},
		) => {
			const affectedFields = Object.keys(newState)
			const currentState = getStateFromCache(entityId, affectedFields)

			// force-resolve all fetching promises, so they get the updated state
			if (!__INTERNAL_DO_NOT_USE) {
				affectedFields.forEach((field) => {
					const fieldFetchPromises = getFetchPromisesForField(entityId, field)
					fieldFetchPromises.forEach((promise) => {
						(typeof promise.resolve === 'function') && promise.resolve(newState[field])
					})
				})
			}

			return new Promise((resolve, reject) => {
				updateCache(entityId, newState) // update cache always - even if cache is disabled for fetch, we utilize it for update error recovery

				if (updateOnServer) {
					if (!APIUpdate) {
						throw new Error('Can\'t update without updater defined')
					}

					const entityUpdatingState = getObjectForEntity(updatingState, entityId)
					affectedFields.forEach((field) => {
						entityUpdatingState[field] = (entityUpdatingState[field] || 0) + 1
					})

					const finishUpdate = () => {
						affectedFields.forEach((field) => {
							entityUpdatingState[field] = (entityUpdatingState[field] || 1) - 1
						})

						notifyListeners(entityId, affectedFields)
					}

					const updatePromise = APIUpdate(entityId, newState)
					updatePromise.then(
						() => {
							finishUpdate()
							resolve()
						},
						(error) => {
							updateCache(entityId, currentState)
							finishUpdate()
							reject(error)
						},
					)
				} else {
					resolve()
				}

				notifyListeners(entityId, affectedFields)
			})
		},
		{
			locally: function updateEntityLocally (
				entityId: TEntityId,
				newState: any,
			): Promise<any> {
				return updateEntity(entityId, newState, {updateOnServer: false})
			}
		}
	)

	function subscribe (
		entityId: TEntityId,
		fields: TEntityFields,
		listener: (state: any, loadingState: any, updatingState: any) => void,
	): () => void {
		const unsubscribeFuncs = []

		const entityListeners = getObjectForEntity(listeners, entityId)

		fields.forEach((field) => {
			if (!entityListeners[field]) {
				entityListeners[field] = []
			}
			entityListeners[field].push(listener)

			// provide unsubscribe func for every field
			unsubscribeFuncs.push(() => {
				const index = entityListeners[field].indexOf(listener)
				if (index >= 0) {
					entityListeners[field].splice(index, 1)
				}
			})
		})

		return function unsubscribe () {
			unsubscribeFuncs.forEach((unsubscribeFunc) => {
				unsubscribeFunc()
			})
		}
	}

	function getEntity (
		entityId: TEntityId,
		fields: TEntityFields,
		{forceFetch = false}: {forceFetch?: boolean} = {},
	): TGetEntityResult {
		const entityCache = getObjectForEntity(cache, entityId)
		const result = {}

		const fieldsCached = []
		const fieldsToFetch = []

		if (!forceFetch) {
			const now = Date.now()
			fields.forEach((field) => {
				const fieldFetchPromises = getFetchPromisesForField(entityId, field)
				if (fieldFetchPromises.length > 0) { // 1) check if it's loading
					result[field] = fieldFetchPromises[fieldFetchPromises.length - 1]
				} else if ( // 2) if not, check cache
					APICacheExpiration &&
					entityCache[field] &&
					(now - entityCache[field].timestamp) < (APICacheExpiration * 1000)
				) {
					fieldsCached.push(field)
				} else {
					fieldsToFetch.push(field)
				}
			})
		} else {
			fieldsToFetch.push(...fields)
		}

		if (fieldsCached.length > 0) {
			Object.entries(getStateFromCache(entityId, fieldsCached)).forEach(([key, value]) => {
				result[key] = Promise.resolve(value)
			})
		}

		// fetch the rest if needed
		if (fieldsToFetch.length > 0) {
			const fetchPromise = APIFetch // consider how to behave when fetcher is undefined
				? APIFetch(entityId, fieldsToFetch)
				: new Promise(() => {})

			fieldsToFetch.forEach((field) => {
				let externalResolve

				result[field] = new Promise((r) => {
					externalResolve = r
					fetchPromise.then((data) => {
						r(data[field])
					})
				})
				const fieldFetchPromises = getFetchPromisesForField(entityId, field)

				const fieldFetchPromise: TPromiseResolvable<any> = Promise.resolve(result[field])
				fieldFetchPromise.resolve = externalResolve // making possible to resolve from outside (eg. when updating entity)

				fieldFetchPromises.push(fieldFetchPromise)

				fieldFetchPromise.then((value) => {
					// find promise and delete
					const index = fieldFetchPromises.findIndex((promise) => promise === fieldFetchPromise)
					index >= 0 && fieldFetchPromises.splice(
						index,
						1,
					)

					// update cache
					updateEntity(entityId, {[field]: value}, {updateOnServer: false, __INTERNAL_DO_NOT_USE: true})
				})
			})

			notifyListeners(entityId, fields)
		}

		return result
	}

	function getState (entityId: TEntityId, fields: TEntityFields) {
		const state = getStateFromCache(entityId, fields)

		return [
			APIStateReviver ? APIStateReviver(state) : state,
			getLoadingStateForFields(entityId, fields),
			getUpdatingStateForFields(entityId, fields),
		]
	}

	function invalidateCache () {
		cache = {}
	}

	return {
		getEntity,
		updateEntity,
		getState,
		subscribe,
		invalidateCache,
		__debug: {
			cache,
			updatingState,
			fetchPromises,
			listeners,
		},
	}
}
