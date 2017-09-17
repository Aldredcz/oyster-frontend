
export default function selectContent (element: HTMLElement | null) {
	if (!element) {
		return
	}

	const body: any = document.body

	if (body && body.createTextRange) {
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
