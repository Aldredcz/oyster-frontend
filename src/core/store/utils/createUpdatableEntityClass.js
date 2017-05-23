// @flow
import {observable, action} from 'mobx'

export interface IUpdatableEntity<T> {
	data: T,
	isLoading: boolean,
	+constructor: () => void,
	+setLoading: (value: boolean) => IUpdatableEntity<T>,
	+setData: (data: $Shape<T>, options: ?{clearLoading: boolean}) => void,
	+setField: (field: $Keys<T>, value: any) => IUpdatableEntity<T>,
	+updateField: <V>(field: $Keys<T>, value: V) => Promise<V>,
}

export interface IUpdatableEntityState<T> {
	data: T,
	isLoading: boolean,
}

// eslint-disable-next-line flowtype/no-weak-types
export default function createUpdatableEntityClass<T: Object> ({
	entityState,
	update,
	idFieldName = 'uuid',
}: {
	entityState: T,
	update: <V>(id: string, field: $Keys<T>, value: V) => Promise<V>,
	idFieldName?: $Keys<T>,
}): Class<IUpdatableEntity<T>> {
	class UpdatableEntity implements IUpdatableEntity<T> {
		@observable data: T = entityState
		@observable isLoading = false

		@action setLoading (value: boolean): * {
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

		@action updateField<V> (field: $Keys<T>, value: V): Promise<V> {
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
