// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import type {TGroup, TGroupField} from './types'

export function oysterRequestFetchGroup (
	uuid: string,
	fields: Array<TGroupField>,
): Promise<TGroup> {
	return request(`${SETTINGS.oysterApi}/group/${uuid}`).then(
		(response) => response.json(),
		// TODO: error handling
	)
}
