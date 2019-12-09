import React, { useContext } from 'react'
import Tile from './tile'
import useNoise, { Seed } from './use-noise'
import useLocalStorage from './use-local-storage'

const posCache = new Map()
const pos = (x, y) => {
	if (posCache.has(`${x},${y}`)) {
		return posCache.get(`${x},${y}`)
	}

	const pos = [x, y]
	posCache.set(`${x},${y}`, pos)
	return pos
}

const types = [
	['coast'],
	['smallIslands', 'smallIslands', 'tinyIslands', 'island'],
	['tinyIslands', 'ocean', 'smallIslands'],
	['ocean', 'ocean', 'tinyIslands', 'smallIslands', 'island'],
]

const descriptions = adj => ({
	'coast': [`The ${adj} coast of Odrein`, `The ${adj} shore of Odrein`, `The ${adj} fringe of the continent`],
	'smallIslands': [`A collection of ${adj} islets`, `A jumble of ${adj} little islands`, `A${adj.startsWith('i') ? 'n' : ''} ${adj} archipelago of islands`],
	'tinyIslands': [`Some ${adj === 'rocky' ? '' : adj} rocks`],
	'island': [`A sizeable, ${adj} isle`, `A vast ${adj} island`],
	'ocean': ['Nothing but the sea', 'A vast expanse of water', 'The endless ocean']
})

const verbs = {
	'coast': ['looms over us', 'reminds us of home', 'is just out of reach',],
	'smallIslands': ['are scattered around', 'dot the horizon', 'all about us', ''],
	'tinyIslands': ['jut out from the water', 'scrape our hull', 'litter the sea', 'make navigation tricky'],
	'island': ['beckons to us', 'draws us in', 'invites us to land', 'bids us welcome'],
	'ocean': ['as far as the eye can see', 'stretches out before us', 'with no sign of land', 'fills our nostrils with salt']
}

const adjectives = ['rocky', 'bare', 'barren', 'jagged', 'rugged', 'irregular', 'craggy', 'bitter', 'bleak', 'desolate', 'windswept', 'foreboding', 'icy', 'frozen']

const omens = [
	'we see seagulls circling',
	'the seas look calmer',
	'thunderclouds gather',
	'a silhouette on the horizon',
	'the wind is leading us',
	'the stars showed us the way',
	'a current draws us',
	'we see a large airborne creature',
	'froth and spray from a maelstrom',
	'a dark shape in the depths',
	'an albatross flies ahead of us'
]

const encounters = {
	'coast': {
		'only the seagulls': [],
		'a long-decayed shipwreck': [
			'it has been picked bare over the ages',
			'some good timbers we can use to repair our ship',
			'a handful of treasure in old Imperial coin'
		],
		'a distant brood of Aaracokra': [
			'they are hostile, and brandish their spears until we leave',
			'they are wary of us, but offer us some scraps of food',
			'they invite us to their nest, share their meal, and tell stories'
		]
	},
	get 'island'() {
		return {
			...this.coast,
			'tracks leading into the hills': [
				'they peter out after a couple of miles',
				'they lead to an impassable cliff',
				'they lead to a mountain crest, but nothing is here',
				'they lead to a dark cave entrance littered with humanoid bones',
				'they lead to an open maw in the mountain, smelling of brimstone',
				`they lead to a dragon's lair. Its occupant drives us back to our ship, and cracks the mast`
			],
		}
	},
	'ocean': {
		'a shoal of fish': [
			'our nets catch only a handful',
			'our nets catch enough to feed us for a few days'
		],
		'a pod of merrow and merfolk': [
			'they board us and steal much of our supplies',
			'we manage to scare them away',
			'we barter food with them for riches'
		],
		'a whale breaching': [
			'it ignores us',
			'it swims alongside us for some distance, and sings'
		],
		'something from below that struck the ship': [
			'after some time waiting, it seems to have vanished',
			'it breaches our hull, but we limp onward',
			`it rends us apart. We're taking on water`
		]
	},
	get 'tinyIslands'() {
		return this.ocean
	},
	get 'smallIslands'() {
		return this.island
	},
}

const getRandom = (noise, array, x, y, scale, weight = 2) => {
	const n = (noise.gen(x / scale, y / scale) + 1) / 2
	const g = Math.floor(n ** weight * array.length)
	return array[g]
}

const getRandomByPos = (noise, array) => (x, y) => {
	const range = array[Math.min(array.length - 1, y)]
	return getRandom(noise, range, x, y, 5, 2)
}

const Description = ({ type, x, y }) => {
	const noise = useNoise()
	const adjective = getRandom(noise, adjectives, x, y, 10, 1.5)
	const description = getRandom(noise, descriptions(adjective)[type], x, y, 2, 1)
	const verb = getRandom(noise, verbs[type], x, y, 7, 1)

	return <><strong>{description}</strong> {verb}.</>
}

const Omen = ({ x, y, discovered }) => {
	const noise = useNoise()
	const unexplored = {
		n: !discovered.some(([dx, dy]) => dx === x && dy === y + 1),
		e: !discovered.some(([dx, dy]) => dx === x + 1 && dy === y),
		s: y !== 0 && !discovered.some(([dx, dy]) => dx === x && dy === y - 1),
		w: x !== 0 && !discovered.some(([dx, dy]) => dx === x - 1 && dy === y),
	}
	const omenDirections = ['west', 'south', 'north', 'east'].filter(d => unexplored[d[0]])
	const omenDirection = getRandom(noise, omenDirections, x, y, 10)
	const omen = getRandom(noise, omens, x, y, 3, 1)

	return (noise.gen(x, y) > 0.5) ? <>To the {omenDirection}, <strong>{omen}</strong>.</> : null;
}

const Encounter = ({ x, y, current }) => {
	const seed = useContext(Seed)
	const [explored, setExplored] = useLocalStorage(`sextant_${seed}_explored`, [])
	const noise = useNoise()

	const getType = getRandomByPos(noise, types)
	const type = getType(x, y)
	const possible = encounters[type]
	const yea = noise.gen(x / 2, y / 3) > 0
	const encounter = getRandom(noise, Object.keys(possible), x, y, 6)

	const encountered = explored.map(e => pos(...e)).includes(pos(x, y))

	const wtf = getRandom(noise, possible[encounter], x, y, 8)

	return yea ? <>
		We see <strong>{encounter}</strong>.{' '}
		{encountered && <>We find <strong>{wtf}</strong>.</>}
		{current && !encountered && <button type='button' onClick={() => {
			setExplored(e => e.concat([pos(x, y)]))
		}}>Explore?</button>}
	</> : null;
}

const Log = ({ discovered }) => {
	const noise = useNoise()
	const getType = getRandomByPos(noise, types)
	const hmm = discovered.slice(-2)
	return <ul style={{ listStyle: 'none', fontFamily: 'Palatino' }}>
		{hmm.map(([x, y], i) => {
			const day = Math.floor(
				3 * (
					i + Math.max(0, discovered.length - 5)
				) * (
					(noise.gen(x / 50, y / 50) + 2) / 2
				)
			) + 1

			const discoveredByNow = discovered.slice(0, (i + Math.max(0, discovered.length - 5)))

			// fuk off eslint
			// eslint-disable-next-line react/no-array-index-key
			return <li key={i} style={i === hmm.length - 1 ? { fontSize: '1.6em' } : null}>
				Day {day}.{' '}
				<Description {...{ x, y }} type={getType(x, y)} />{' '}
				<Omen {...{ x, y }} discovered={discoveredByNow} />{' '}
				<Encounter {...{ x, y }} current={i === hmm.length - 1} />
			</li>
		})}
	</ul>
}

export default ({ width, height }) => {
	const seed = useContext(Seed)
	const [current, setCurrent] = useLocalStorage(`sextant_${seed}_current`, pos(0, 0))
	const [discovered, setDiscovered] = useLocalStorage(`sextant_${seed}_discovered`, [
		pos(0, 0),
	])
	const noise = useNoise()

	const maxY = Math.max(...discovered.map(([, y]) => y))
	const getType = getRandomByPos(noise, types)

	const uniqDisco = Array.from(new Set(discovered.map(([x, y]) => pos(x, y))))

	return (
		<>
			<div style={{ position: 'absolute', height: `${(maxY + 1) * height}px`, minHeight: 'calc(100vh - 8em)', left: 0, top: '8em' }}>
				{uniqDisco.map(([x, y]) => {
					const unexplored = {
						n: !discovered.some(([dx, dy]) => dx === x && dy === y + 1),
						e: !discovered.some(([dx, dy]) => dx === x + 1 && dy === y),
						s: !discovered.some(([dx, dy]) => y === 0 || dx === x && dy === y - 1),
						w: !discovered.some(([dx, dy]) => x === 0 || dx === x - 1 && dy === y),
					}

					const shadows = [
						unexplored.n && `inset 0 20px 20px -10px #fff1e5`,
						unexplored.e && `inset -20px 0 20px -10px #fff1e5`,
						unexplored.s && `inset 0 -20px 20px -10px #fff1e5`,
						unexplored.w && `inset 20px 0 20px -10px #fff1e5`,
					].filter(Boolean)

					return <div
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
						<div style={{ position: "absolute", width: '100%', height: '100%', zIndex: 1, left: 0, top: 0, boxShadow: shadows.join(', '), pointerEvents: 'none' }} />
						<div style={{ position: "absolute", width: '100%', height: '100%', zIndex: -1, left: 0, top: 0, boxShadow: '0 0 50px 50px #fff1e5', pointerEvents: 'none' }} />
						{location.hash !== '#display' && pos(...current) === pos(x, y) &&
							<div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, zIndex: 3 }}>
								{current[0] !== 0 && <button
									type='button'
									onClick={() => {
										const [x, y] = current
										const next = [x - 1, y]
										setCurrent(next)
										setDiscovered(d => d.concat([next]))
									}}
									style={{ position: 'absolute', right: '100%', top: '50%', width: '2em', height: '2em', padding: 0, textAlign: 'center', marginTop: '-1em' }}
								>
									←
				</button>}
								<button
									type='button'
									onClick={() => {
										const [x, y] = current
										const next = [x + 1, y]
										setCurrent(next)
										setDiscovered(d => d.concat([next]))
									}}
									style={{ position: 'absolute', left: '100%', top: '50%', width: '2em', height: '2em', padding: 0, textAlign: 'center', marginTop: '-1em' }}
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
									style={{ position: 'absolute', bottom: '100%', left: '50%', width: '2em', height: '2em', padding: 0, textAlign: 'center', marginLeft: '-1em' }}
								>
									↑
				</button>
								{current[1] !== 0 && <button
									type='button'
									onClick={() => {
										const [x, y] = current
										const next = [x, y - 1]
										setCurrent(next)
										setDiscovered(d => d.concat([next]))
									}}
									style={{ position: 'absolute', top: '100%', left: '50%', width: '2em', height: '2em', padding: 0, textAlign: 'center', marginLeft: '-1em' }}
								>
									↓
								</button>}</div>
						}
					</div>
				})}
			</div>

			<div style={{ position: 'fixed', zIndex: 2 }}>
				<Log discovered={discovered} />
			</div>


			{
				location.hash !== '#display' &&
				<div style={{ position: 'fixed', right: 0, zIndex: 2 }}>
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
				</div>
			}
		</>
	)
}