// @flow
import * as TaskAPI from './api'
import type {TTask} from './types'
import {observable, action} from 'mobx'

import {persistStateSingleton} from 'core/utils/mobx'

interface ITaskState {
	data: TTask,
	isLoading: boolean,
}

export class Task implements ITaskState {
	@observable data = {
		uuid: '',
		name: null,
		brief: null,
		deadline: null,
		completedAt: null,
		ownersByIds: null,
		actionsSet: null,
	}
	@observable isLoading = false

	@action setLoading (value: boolean) {
		this.isLoading = value
	}

	@action setData (
		data: $Shape<TTask>,
		{clearLoading = true}: {clearLoading: boolean} = {},
	) {
		//$FlowFixMe
		Object.assign(this.data, data)

		if (clearLoading) {
			this.isLoading = false
		}
	}

	@action updateField (field: $Keys<TTask>, value: any): Promise<any> {
		const oldValue = (this.data: any)[field]
		if (oldValue === value) {
			return Promise.resolve(value)
		}

		this.data[field] = value

		let request
		switch (field) {
			case 'name':
				request = TaskAPI.oysterRequestTaskRename(this.data.uuid, value)
				break
			case 'brief':
				request = TaskAPI.oysterRequestTaskBriefChange(this.data.uuid, value)
				break
			case 'deadline':
				request = TaskAPI.oysterRequestTaskDeadlineChange(this.data.uuid, value)
				break
			default:
				throw new Error(`Cannot update field '${field} in Task'`)
		}

		request.catch(() => {
			alert(`Updating '${oldValue}' -> ${value} failed... Sorry.`)
			this.data[field] = oldValue
		})

		return request
	}
}

export class TasksStore {
	@observable tasks: Map<string, Task> = new Map()

	@action setTask (uuid: string, taskState?: $Shape<ITaskState>): Task {
		let task: Task
		if (this.tasks.has(uuid)) {
			task = (this.tasks.get(uuid): any)
		} else {
			task = new Task()
			this.tasks.set(uuid, task)
		}

		Object.assign(task, taskState)

		return task
	}

	getTask (uuid: string): Task {
		if (this.tasks.has(uuid)) {
			return (this.tasks.get(uuid): any)
		}

		const newTask = this.setTask(uuid)

		newTask.setLoading(true)
		TaskAPI.oysterRequestFetchTask(uuid)
			.then((data) => {
				newTask.setData(data)
			})

		return newTask
	}
	getEntity = this.getTask.bind(this)
}

export default persistStateSingleton(new TasksStore())
