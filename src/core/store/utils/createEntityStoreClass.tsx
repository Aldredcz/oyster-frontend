import {observable, action} from 'mobx'
import {IUpdatableEntity, IUpdatableEntityState} from './createUpdatableEntityClass'

export interface IEntityStore<Entity extends {data: any, [key: string]: any}> {
	entities: Map<string, Entity>,
	readonly constructor: Function,
	readonly initEntity: (id: string) => Entity,
	readonly setEntity: (
		id: string,
		entityState: Partial<IUpdatableEntityState<Partial<Entity['data']>>>
	) => IEntityStore<Entity>,
	readonly getEntity: (id: string) => Entity,
}

export default function createUpdatableEntityClass<T extends IUpdatableEntity<any>> ({
	EntityClass,
	fetch,
}: {
	EntityClass: new () => T,
	fetch: (id: string) => Promise<Partial<T['data']>>,
}): new () => IEntityStore<T> {
	class EntityStore {
		@observable entities: Map<string, T> = new Map()

		@action initEntity (id) {
			const entity = new EntityClass()
			this.entities.set(id, entity)

			return entity
		}

		@action setEntity (id, entityState) {
			let entity: T
			if (this.entities.has(id)) {
				entity = this.entities.get(id)
			} else {
				entity = this.initEntity(id)
			}

			// deep-merge data first
			if (entityState.data) {
				Object.assign(entity.data, entityState.data)
				delete entityState.data
			}

			// then merge the rest
			Object.assign(entity, entityState)

			return this
		}

		getEntity (id) {
			if (this.entities.has(id)) {
				return this.entities.get(id)
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
