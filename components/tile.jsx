import React from 'react'
import Canvas from './canvas'
import { Simplex2 } from 'tumult'
import gradientMap from './gradientmap'

const clamp = x => Math.min(1, Math.max(0, x))

const types = {
	island(x, y, g) {
		return (1 - (((x - 200) / 200) ** 2 + ((y - 200) / 200) ** 2) ** 2) * g
	},

	coast(x, y, g) {
		return clamp(g * y / 300 + y / 1600)
	},

	smallIslands(x, y, g) {
		const edgeFade = clamp(x / 50) * clamp((400 - x) / 50) * clamp(y / 50) * clamp((400 - y) / 50)
		return g ** 1.5 * edgeFade
	}
}

export default ({ type, scale = 4 }) => <Canvas draw={(ctx, canvas) => {
	const { width, height } = canvas
	const noise = new Simplex2('seed')

	const data = new Uint8ClampedArray(width * height * 4)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (x + y * width) * 4
			const n = (noise.octavate(scale, x / 100, y / 100) + 1) / 2
			const g = Math.floor(256 * types[type](x, y, n))

			data[i] = g
			data[i + 1] = g
			data[i + 2] = g
			data[i + 3] = 255
		}
	}

	const image = new ImageData(data, width, height)
	ctx.putImageData(image, 0, 0)

	gradientMap(canvas, {
		0: '#fff1e5',
		0.49: '#fff1e5',
		0.491: '#999189',
		0.5: '#999189',
		0.509: '#999189',
		0.51: '#f2dfce',
		1: '#fffcfa',
	})
}} width={400} height={400} />