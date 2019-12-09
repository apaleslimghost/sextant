import React, { useContext } from 'react'
import Tile from './tile'
import useNoise, { Seed } from './use-noise'
import useLocalStorage from './use-local-storage'

const types = [
	['coast'],
	['smallIslands', 'smallIslands', 'tinyIslands', 'island'],
	['tinyIslands', 'ocean', 'smallIslands'],
	['ocean', 'ocean', 'tinyIslands', 'smallIslands', 'island'],
]

const descriptions = adj => ({
	'coast': [`The ${adj} coast of Odrein`, `The ${adj} shore of Odrein`, `The ${adj} fringe of the continent`],
	'smallIslands': [`A collection of ${adj} islets`, `A jumble of ${adj} little islands`, `A${adj.startsWith('i') ? 'n' : ''} ${adj} archipelago`],
	'tinyIslands': [`Some ${adj === 'rocky' ? '' : adj} rocks`],
	'island': [`A sizeable, ${adj} isle`, `A vast ${adj} island`],
	'ocean': ['Nothing but the ocean', 'A vast expanse of water']
})

const verbs = {
	'coast': ['looms over us', 'reminds us of home', 'is just out of reach'],
	'smallIslands': ['are scattered around', 'dot the horizon'],
	'tinyIslands': ['jut out from the water', 'scrape our hull'],
	'island': ['beckons to us', 'draws us in', 'invites us to land'],
	'ocean': ['as far as the eye can see', 'stretches out before us', 'with no sign of land']
}

const adjectives = ['rocky', 'bare', 'barren', 'jagged', 'rugged', 'irregular', 'craggy', 'bitter', 'bleak', 'desolate', 'windswept', 'foreboding', 'icy', 'frozen']

const getRandom = (noise, array, x, y, scale) => {
	const n = (noise.gen((x % scale) / scale, (y % scale) / scale) + 1) / 2
	const g = Math.floor(n ** 2 * array.length)
	return array[g]
}

const getRandomByPos = (noise, array) => (x, y) => {
	const range = array[Math.min(array.length - 1, y)]
	return getRandom(noise, range, x, y, 5)
}

const Description = ({ type, x, y }) => {
	const noise = useNoise()
	const adjective = getRandom(noise, adjectives, x, y, 10)
	const description = getRandom(noise, descriptions(adjective)[type], x, y, 2)
	const verb = getRandom(noise, verbs[type], x, y, 7)

	return <><strong>{description}</strong> {verb}.</>
}

export default ({ width, height }) => {
	const seed = useContext(Seed)
	const [current, setCurrent] = useLocalStorage(`sextant_${seed}_current`, [0, 0])
	const [discovered, setDiscovered] = useLocalStorage(`sextant_${seed}_discovered`, [
		[0, 0],
	])
	const noise = useNoise()

	const maxY = Math.max(...discovered.map(([, y]) => y))
	const getType = getRandomByPos(noise, types)

	const uniqDiscovered = Array.from(new Set(discovered.map(([x, y]) => `${x},${y}`)), s => s.split(','))

	return (
		<>
			<div style={{ position: 'absolute', height: `${(maxY + 1) * height}px`, minHeight: 'calc(100vh - 2em)', left: 0, top: '2em' }}>
				{uniqDiscovered.map(([x, y]) => (
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
			</div>

			<div style={{ position: 'fixed' }}>
				<Description x={current[0]} y={current[1]} type={getType(...current)} />
			</div>

			{location.hash !== '#display' &&
				<div style={{ position: 'fixed', right: '8px' }}>
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
					<button
						type='button'
						onClick={() => {
							window.open(
								location.href + '#display',
								'sextant',
								'width=600,height=400'
							)
						}}
					>
						⎋
				</button>
				</div>}
		</>
	)
}