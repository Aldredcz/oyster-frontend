import browserHistory from 'core/utils/browserHistory'

export function setPage (path, data) {
	return () => browserHistory.push(path)
}
