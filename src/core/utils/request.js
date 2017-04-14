// @flow
import {getAuthorizationData} from '../authorization'

type TOptions = {
	headers?: {[key: string]: string},
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	data?: Blob | FormData | URLSearchParams | string
}


export default async function request (url: string, options: TOptions = {}) {
	const headers = Object.assign({}, {
		'Content-Type': 'application/json',
	}, options.headers)

	const {token} = getAuthorizationData()
	if (token && url.startsWith('/api')) {
		headers.authToken = token
	}

	const response: Response = await fetch(url, {
		...options,
		headers,
	})

	throwErrorIfAny(response)

	return response
}

type ErrorWithResponse = Error & {
	response?: Response
}

export function throwErrorIfAny (response: Response): void {
	if (response.ok !== true) {
		const error: ErrorWithResponse = new Error(response.statusText)
		error.response = response
		throw error
	}
}
