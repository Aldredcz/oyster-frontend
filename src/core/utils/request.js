import {getAuthorizationData} from '../authorization'

export default async function request (url, options = {}) {
	const headers = Object.assign({}, {
		'Content-Type': 'application/json',
	}, options.headers)

	const {token} = getAuthorizationData()
	if (token && url.startsWith(`SETTINGS.oysterApi`)) {
		headers.authToken = token
	}

	const response = await fetch(url, {
		...options,
		headers,
	})

	throwErrorIfAny(response)

	return response
}

export function throwErrorIfAny (response) {
	if (response.ok !== true) {
		const error = new Error(response.statusText)
		error.response = response
		throw error
	}
}
