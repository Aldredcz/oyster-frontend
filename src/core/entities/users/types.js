// @flow
export type TUser = {
	uuid: string,
	name?: string,
	surname?: string,
	email?: string,
	accountsByIds?: Array<string>,
}

export type TUserField = $Keys<TUser>
