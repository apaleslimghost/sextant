import React from 'react'
import { render } from 'react-dom'
import { Seed } from './components/use-noise'
import Map from './components/map'

// TODO: prompts, weather, dislpay screen, worker

render(
	<Seed.Provider value={'hmm'}>
		<Map width={200} height={200} />
	</Seed.Provider>,
	document.querySelector('main'),
)
