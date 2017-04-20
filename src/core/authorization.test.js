import * as Authorization from './authorization'

const input = {token: 'bla-bla-bla-bla'}

test('getAuthorizationData after setAuthorizationData gives result', () => {
	Authorization.setAuthorizationData(input)
	const output = Authorization.getAuthorizationData()

	expect(output).toEqual(input)
})

test('getAuthorizationData after removeAuthorizationData gives empty object', () => {
	Authorization.setAuthorizationData(input)
	Authorization.removeAuthorizationData()
	const output = Authorization.getAuthorizationData()

	expect(output).toEqual({})
})
