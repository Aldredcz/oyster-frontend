export function setAuthorizationData (data) {
	localStorage.setItem('authorization', JSON.stringify(data))
}

export function getAuthorizationData () {
	return JSON.parse(localStorage.getItem('authorization') || '{}')
}

export function removeAuthorizationData () {
	localStorage.removeItem('authorization')
}

