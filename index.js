import React, { useState } from 'react'
import { render } from 'react-dom'
import { Seed } from './components/use-noise'
import Map from './components/map'
import useLocalStorage from './components/use-local-storage'

// TODO: omens, further exploration, weather & wind, supplies, more descriptions, worker

const App = () => {
	const [seedInput, setSeedInput] = useState('')
	const [seed, setSeed] = useLocalStorage('sextant_seed', '')

	return seed ? (
		<Seed.Provider value={seed}>
			<Map width={200} height={200} />
		</Seed.Provider>
	) : (
		<form
			onSubmit={event => {
				event.preventDefault()
				setSeed(seedInput)
			}}
		>
			<input
				type='text'
				placeholder='Seed&hellip;'
				value={seedInput}
				onChange={event => setSeedInput(event.target.value)}
			/>
		</form>
	)
}

render(<App />, document.querySelector('main'))
