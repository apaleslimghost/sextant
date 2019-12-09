import { useState, useEffect } from 'react'

export default (key, defaultValue) => {
	defaultValue = localStorage[key]
		? JSON.parse(localStorage[key])
		: defaultValue

	const [state, setState] = useState(defaultValue)

	useEffect(() => {
		localStorage[key] = JSON.stringify(state)
	}, [key, state])

	useEffect(() => {
		function onStorage(event) {
			if (event.key === key) {
				setState(JSON.parse(event.newValue))
			}
		}

		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [key])

	return [state, setState]
}
