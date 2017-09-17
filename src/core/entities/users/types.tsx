import {TAccountFromApi} from 'core/entities/accounts'

export type TUserCommon = {
	uuid: string,
	name: string | null,
	surname: string | null,
	email: string | null,
}

export type TUser = TUserCommon & {
	accountsByIds: Array<string> | null,
}

export type TUserFromApi = Partial<TUserCommon & {
	accounts: Array<TAccountFromApi> | null,
}>

export type TUserField = keyof TUser

export const initialState: TUser = {
	uuid: '',
	name: null,
	surname: null,
	email: null,
	accountsByIds: null,
}
