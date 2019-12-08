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

	gradientMap(canvas, {
		0: 'blue',
		0.5: 'blue',
		0.51: 'black',
		0.52: 'green',
		1: 'green',
	})
}} width={400} height={400} />