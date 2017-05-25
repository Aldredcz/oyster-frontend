// @flow

window.mobx = {}

export function generateSingleton<T: Object> (SingletonClass: Class<T>): T {
	//$FlowFixMe
	const className: string = SingletonClass.name

	if (!window.mobx[className]) { // instantiate only once
		window.mobx[className] = new SingletonClass()
	}

	// TODO: think about prototype update to support "action" hot reload

	return window.mobx[className]
}
