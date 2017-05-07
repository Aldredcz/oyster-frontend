// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import type {TTask, TTaskField} from './types'

export function oysterRequestFetchTask (
	uuid: string,
	fields: Array<TTaskField>,
): Promise<TTask> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}`).then(
		(response) => response.json(),
		// TODO: error handling
	)
}
