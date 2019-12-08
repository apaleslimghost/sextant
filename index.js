import React, { createContext } from 'react'
import { render } from 'react-dom'
import Tile from './components/tile'
import { Seed } from './components/useseed.js'

render(
	<Seed.Provider value={'hello'}>
		<Tile type='smallIslands' width={500} height={500} />
	</Seed.Provider>,
	document.querySelector('main'),
)
