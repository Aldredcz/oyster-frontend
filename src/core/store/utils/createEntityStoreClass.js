// @flow
import {observable, action} from 'mobx'
import type {IUpdatableEntity, IUpdatableEntityState} from './createUpdatableEntityClass'

export interface IEntityStore<Entity> {
	entities: Map<string, Entity>,
	+constructor: () => void,
	+initEntity: (id: string) => Entity,
	+setEntity: (
		id: string,
		entityState: $Shape<IUpdatableEntityState<$PropertyType<Entity, 'data'>>>
	) => IEntityStore<Entity>,
	+getEntity: (id: string) => Entity,
}

// TODO: solve generic type inferrence not working - mby only solution is Typescript:
// https://github.com/niieani/typescript-vs-flowtype#call-time-generic-parameters
// eslint-disable-next-line flowtype/no-weak-types
export default function createUpdatableEntityClass<T: IUpdatableEntity<*>> ({
	EntityClass,
	fetch,
}: {
	EntityClass: Class<T>,
	fetch: (id: string) => Promise<$PropertyType<T, 'data'>>,
}): Class<IEntityStore<T>> {
	class EntityStore {
		constructor (props: any) {
			Object.assign(this, props)
		}

		@observable entities: Map<string, T> = new Map()

		@action initEntity (id) {
			const entity = new EntityClass()
			this.entities.set(id, entity)

			return entity
		}

		@action setEntity (id, entityState) {
			let entity: T
			if (this.entities.has(id)) {
				entity = (this.entities.get(id): $FlowFixMe)
			} else {
				entity = this.initEntity(id)
			}

			Object.assign(entity, entityState)

			return this
		}

		getEntity (id) {
			if (this.entities.has(id)) {
				return (this.entities.get(id): $FlowFixMe)
			}

			const newEntity = this.initEntity(id)

			newEntity.setLoading(true)
			fetch(id)
				.then((data) => {
					newEntity.setData(data)
				})

			return newEntity
		}
	}

	return EntityStore
}
