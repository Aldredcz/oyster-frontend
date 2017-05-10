// @flow
export type TUserCommon = {
	uuid: string,
	name?: string,
	surname?: string,
	email?: string,
}

export type TUser = TUserCommon & {
	accountsByIds?: Array<string>,
}


export type TUserFromApi = TUserCommon & {
	accounts?: Array<string>,
}

export type TUserField = $Keys<TUser>
