// @flow
import {combineReducers} from 'redux'

import {signupReducer} from 'modules/Signup'
import accountReducer from './account/account-reducer'

export default combineReducers({
	signup: signupReducer,
	account: accountReducer,
})
