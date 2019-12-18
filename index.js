import React, { useState } from 'react'
import { render } from 'react-dom'
import { Seed } from './components/use-noise'
import Map from './components/map'
import useLocalStorage from './components/use-local-storage'

// TODO: further exploration & encounters, soundscapes, styles, weather & wind, supplies, worker

const App = () => {
	const [seedInput, setSeedInput] = useState('')
	const [seed, setSeed] = useLocalStorage('sextant_seed', '')

	return seed ? (
		<Seed.Provider value={seed}>
			<Map width={300} height={300} />
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
				placeholder='The Voyage of&hellip;'
				value={seedInput}
				onChange={event => setSeedInput(event.target.value)}
				style={{
					fontSize: '2em',
					background: 'transparent',
					border: '0 none',
					borderBottom: '3px solid',
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					fontFamily: 'Palatino',
				}}
			/>
		</form>
	)
}

render(<App />, document.querySelector('main'))
