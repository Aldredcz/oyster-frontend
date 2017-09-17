import {observable, action} from 'mobx'

export interface IUpdatableEntity<T> {
	data: T,
	isLoading: boolean,
	readonly constructor: Function,
	readonly setLoading: (value: boolean) => IUpdatableEntity<T>,
	readonly setData: (data: Partial<T>, options?: {clearLoading: boolean} | null) => void,
	readonly setField: (field: keyof T, value: any) => IUpdatableEntity<T>,
	readonly updateField: <V>(field: keyof T, value: V) => Promise<V>,
}

export interface IUpdatableEntityState<T> {
	data: T,
	isLoading: boolean,
}

export default function createUpdatableEntityClass<T extends {uuid: string}> ({
	entityState,
	update,
	idFieldName = 'uuid',
}: {
	entityState: T,
	update: <V>(id: string, field: keyof T, value: V) => Promise<V>,
	idFieldName?: keyof T,
}): new (...args: any[]) => IUpdatableEntity<T> {
	class UpdatableEntity implements IUpdatableEntity<T> {
		@observable data: T = entityState
		@observable isLoading = false

		@action setLoading (value: boolean) {
			this.isLoading = value

			return this
		}

		@action setData (
			data,
			//$FlowFixMe - assigning empty object as a default value!!!
			{clearLoading = true} = {},
		) {
			Object.assign(this.data, data)
			if (clearLoading) {
				this.setLoading(false)
			}
		}

		@action setField (field, value) {
			this.data[field] = value
			return this
		}

		@action updateField<V> (field: keyof T, value: V): Promise<V> {
			const oldValue = this.data[field]
			if (oldValue === value) {
				return Promise.resolve(value)
			}

			this.setField(field, value) // optimistic update

			const request = update(this.data[idFieldName], field, value)

			request.catch(() => {
				alert(`Updating '${field}' failed... Sorry. TODO`)
				this.data[field] = oldValue
			})

			return request
		}
	}

	return UpdatableEntity
}
