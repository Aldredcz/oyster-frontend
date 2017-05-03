// @flow
import type {TSignupFormField, TSignupState} from '../store/types'

export function validateField (
	field: TSignupFormField,
	value: string,
): ?string {
	if (value.length === 0) {
		return 'This field is required,'
	}

	switch (field) {
		case 'email':
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (!re.test(value)) {
				return 'This doesn\'t look like a valid email address :('
			}
			break
		case 'password':
			if (value.length < 6) {
				return 'Your password should be at least 6 characters long. We care about your security.'
			}
			break
	}
}

export function validatePasswords (formData: $PropertyType<TSignupState, 'formData'>): ?string {
	if (formData.password !== formData.passwordConfirm) {
		return 'Passwords do not match'
	}
}
