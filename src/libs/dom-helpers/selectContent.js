// @flow

export default function selectContent (element: ?HTMLElement) {
	if (!element) {
		return
	}

	const body = document.body

	if (body && body.createTextRange) {
		//$FlowFixMe
		const range = body.createTextRange()
		range.moveToElementText(element)
		range.select()
	} else if (window.getSelection) {
		const selection = window.getSelection()
		const range = document.createRange()
		range.selectNodeContents(element)
		selection.removeAllRanges()
		selection.addRange(range)
	}
}
