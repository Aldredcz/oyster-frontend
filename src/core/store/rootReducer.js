// @flow
import {combineReducers} from 'redux'

import {signupReducer} from 'modules/Signup'

export default combineReducers({
	signup: signupReducer,
})
