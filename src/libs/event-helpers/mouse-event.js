// @flow
export function isOpeningInNewWindow (ev: MouseEvent) {
	// http://stackoverflow.com/a/20087506/4697463
	return (
		ev.ctrlKey ||
		ev.shiftKey ||
		ev.metaKey || // apple
		(ev.button && ev.button === 1) // middle click, >IE9 + everyone else
	)
}
