export type TAuthorizationData = {
	readonly token?: string,
	readonly uuid?: string,
}

export function setAuthorizationData (data: TAuthorizationData) {
	localStorage.setItem('authorization', JSON.stringify(data))
}

export function getAuthorizationData (): TAuthorizationData {
	return JSON.parse(localStorage.getItem('authorization') || '{}')
}

export function removeAuthorizationData () {
	localStorage.removeItem('authorization')
}

