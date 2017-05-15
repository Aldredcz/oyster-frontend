// @flow
import type {Theme} from './types'
import typography from './typography'

export const visualTheme: Theme = {
  typography: typography({
    fontSize: 16,
    fontSizeScale: 'step5', // perfect fourth, modularscale.com
    lineHeight: 24,
  }),
  colors: {
  },
  page: {
  },
  text: {
    bold: 600,
    color: 'black',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  heading: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  p: {
    marginBottom: 1,
  },
  button: {
    borderRadius: 2,
    borderWidth: 1,
    marginHorizontal: 0.25,
    marginVertical: 0.3,
    paddingVertical: 0.2,
    disabledOpacity: 0.5,
  },
  form: {
    marginBottom: 1,
    maxWidth: 21,
  },
  textInput: {
    disabledOpacity: 0.5,
  },
}
