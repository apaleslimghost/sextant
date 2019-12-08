import React from 'react'
import Canvas from './canvas'
import { Simplex2 } from 'tumult'
import gradientMap from './gradientmap'

export default ({ }) => <Canvas draw={(ctx, canvas) => {
	const noise = new Simplex2('seed')
	const { width, height } = canvas

	const data = new Uint8ClampedArray(width * height * 4)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (x + y * width) * 4
			const n = noise.octavate(5, x / 100, y / 100)
			const g = (128 + Math.floor(128 * n))

			data[i] = g
			data[i + 1] = g
			data[i + 2] = g
			data[i + 3] = 255
		}
	}

	const image = new ImageData(data, width, height)
	ctx.putImageData(image, 0, 0)

	ctx.globalCompositeOperation = 'multiply'
	const round = ctx.createRadialGradient(200, 200, 0, 200, 200, 200)
	round.addColorStop(0, 'white')
	round.addColorStop(0.8, 'white')
	round.addColorStop(1, 'black')

	ctx.fillStyle = round
	ctx.fillRect(0, 0, width, height)

	ctx.globalCompositeOperation = 'source-over'

	gradientMap(canvas, {
		0: '#fff1e5',
		0.49: '#fff1e5',
		0.491: '#ccc1b7',
		0.5: '#ccc1b7',
		0.509: '#ccc1b7',
		0.51: '#f2dfce',
		1: '#f2dfce',
	})
}} width={400} height={400} />