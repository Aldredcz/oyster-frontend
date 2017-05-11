// @flow
import type {TAccountFromApi} from 'core/entities/accounts'

export type TUserCommon = {
	uuid: string,
	name: ?string,
	surname: ?string,
	email: ?string,
}

export type TUser = TUserCommon & {
	accountsByIds: ?Array<string>,
}

export type TUserFromApi = $Shape<TUserCommon & {
	accounts: ?Array<TAccountFromApi>,
}>

export type TUserField = $Keys<TUser>
