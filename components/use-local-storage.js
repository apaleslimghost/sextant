import { useState, useEffect } from 'react'

export default (key, defaultValue) => {
	defaultValue = localStorage[key]
		? JSON.parse(localStorage[key])
		: defaultValue

	const [state, setState] = useState(defaultValue)

	useEffect(() => {
		localStorage[key] = JSON.stringify(state)
	}, [key, state])

	return [state, setState]
}
