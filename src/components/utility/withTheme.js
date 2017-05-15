// @flow
import type {Theme} from 'components/core/config/themes/types'
import PropTypes from 'prop-types'

export type ThemeContext = {theme: Theme}

const withTheme = (Component: ReactClass<mixed>) => {
	Component.contextTypes = {
		...Component.contextTypes,
		theme: PropTypes.object,
	}
}

export default withTheme
