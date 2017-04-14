// @flow
export type TAuthorizationData = {
	token: ?string
}

export function setAuthorizationData (data: TAuthorizationData): void {
	localStorage.setItem('authorization', JSON.stringify(data))
}

export function getAuthorizationData (): TAuthorizationData {
	return JSON.parse(localStorage.getItem('authorization') || '{}')
}

export function removeAuthorizationData (): void {
	localStorage.removeItem('authorization')
}

