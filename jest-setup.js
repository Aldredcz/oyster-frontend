class StorageMock {
	constructor () {
		this.store = {}
	}

	clear () {
		this.store = {}
	}

	getItem (key) {
		return this.store[key]
	}

	setItem (key, value) {
		this.store[key] = value.toString()
	}

	removeItem (key) {
		delete this.store[key]
	}
}

window.localStorage = new StorageMock
window.sessionStorage = new StorageMock


/**
 * The reason that we want to attach all the window properties to the global object is because developers
 * often write code that is meant for the browser without explicitly using the global environment object.
 *
 * For instance, in React, the developers write:
 * 		navigator.userAgent.indexOf('Chrome') > -1
 * instead of:
 * 		window.navigator.userAgent.indexOf('Chrome') > -1
 *
 * Without taking window.navigator and putting it on global.navigator, you’d get an error like this when running your tests:
 * 		ReferenceError: navigator is not defined
 */
for (const key in window) {
	if (!window.hasOwnProperty(key) || key in global) {
		continue
	}

	global[key] = window[key]
}


beforeEach(() => {
	localStorage.clear()
})

