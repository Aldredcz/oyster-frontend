import {getAuthorizationData} from '../authorization'

type TOptions = {
	headers?: {[key: string]: string},
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	body?: Blob | FormData | URLSearchParams | string,
}


export default async function request (url: string, options: TOptions = {}): Promise<Response> {
	const headers = Object.assign({}, {
		'Content-Type': 'application/json',
	}, options.headers)

	const {token} = getAuthorizationData()
	if (token && url.startsWith('/api')) {
		headers['Authorization-Token'] = token
	}

	const response: Response = await fetch(url, {
		...options,
		headers,
	})

	throwErrorIfAny(response)

	return response
}

type TErrorWithResponse = Error & {
	response?: Response,
}

export function throwErrorIfAny (response: Response) {
	if (response.ok !== true) {
		const error: TErrorWithResponse = new Error(response.statusText)
		error.response = response
		throw error
	}
}
