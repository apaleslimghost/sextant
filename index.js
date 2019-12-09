import React, { useState } from 'react'
import { render } from 'react-dom'
import Tile from './components/tile'
import useNoise, { Seed } from './components/use-noise'

// TODO: map layout, worker, location-dependent variables, weather, prompts, localstorage & dislpay screen, fixed coasts

const types = [
	['coast'],
	['smallIslands', 'smallIslands', 'tinyIslands', 'island'],
	['tinyIslands', 'ocean', 'smallIslands'],
	['ocean', 'ocean', 'tinyIslands', 'smallIslands', 'island'],
]

const Map = ({ width, height }) => {
	const [current, setCurrent] = useState([0, 0])
	const [discovered, setDiscovered] = useState([[0, 0]])
	const noise = useNoise()

	const getType = (x, y) => {
		const n = (noise.gen(x / 5, y / 5) + 1) / 2
		const range = types[Math.min(types.length - 1, y)]
		const g = Math.floor(n ** 2 * range.length)
		return range[g]
	}

	return (
		<>
			{discovered.map(([x, y]) => (
				<div
					key={`${x},${y}`}
					style={{
						position: 'absolute',
						bottom: `${y * height}px`,
						left: `${x * width}px`,
					}}
				>
					<Tile
						x={x}
						y={y}
						type={getType(x, y)}
						width={width}
						height={height}
					/>
				</div>
			))}

			<div style={{ position: 'absolute' }}>
				<button
					type='button'
					disabled={current[0] === 0}
					onClick={() => {
						const [x, y] = current
						const next = [x - 1, y]
						setCurrent(next)
						setDiscovered(d => d.concat([next]))
					}}
				>
					←
				</button>
				<button
					type='button'
					onClick={() => {
						const [x, y] = current
						const next = [x + 1, y]
						setCurrent(next)
						setDiscovered(d => d.concat([next]))
					}}
				>
					→
				</button>
				<button
					type='button'
					onClick={() => {
						const [x, y] = current
						const next = [x, y + 1]
						setCurrent(next)
						setDiscovered(d => d.concat([next]))
					}}
				>
					↑
				</button>
				<button
					type='button'
					disabled={current[1] === 0}
					onClick={() => {
						const [x, y] = current
						const next = [x, y - 1]
						setCurrent(next)
						setDiscovered(d => d.concat([next]))
					}}
				>
					↓
				</button>
			</div>
		</>
	)
}

render(
	<Seed.Provider value={'hmm'}>
		<Map width={200} height={200} />
	</Seed.Provider>,
	document.querySelector('main'),
)
