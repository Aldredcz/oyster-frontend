// @flow
import type {TTheme} from 'core/config/themes/types'
import PropTypes from 'prop-types'

export type TThemeContext = {theme: TTheme}

const withTheme = (Component: ReactClass<mixed>) => {
	Component.contextTypes = {
		...Component.contextTypes,
		theme: PropTypes.object,
	}
}

export default withTheme
