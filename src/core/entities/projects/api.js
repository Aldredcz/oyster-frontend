// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import type {TProject, TProjectField} from './types'

export function oysterRequestFetchProject (
	uuid: string,
	fields: Array<TProjectField>,
): Promise<TProject> {
	return request(`${SETTINGS.oysterApi}/project/${uuid}`).then(
		(response) => response.json(),
		// TODO: error handling
	)
}
