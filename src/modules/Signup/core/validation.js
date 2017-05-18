// @flow
import {isEmail, isPassword} from 'libs/validation/validators'
import type {TSignupFormField, ISignupStoreShape} from './store/types'

export function validateField (
	field: TSignupFormField,
	value: string,
): ?string {
	if (value.length === 0) {
		return 'This field is required,'
	}

	switch (field) {
		case 'email':
			if (!isEmail(value)) {
				return 'This doesn\'t look like a valid email address :('
			}
			break
		case 'password':
			if (!isPassword(value)) {
				return 'Your password should be at least 6 characters long. We care about your security.'
			}
			break
	}
}

export function validatePasswords (formData: $PropertyType<ISignupStoreShape, 'formData'>): ?string {
	if (formData.password !== formData.passwordConfirm) {
		return 'Passwords do not match'
	}
}
