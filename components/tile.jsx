import React from 'react'
import Canvas from './canvas'
import { Simplex2 } from 'tumult'
import gradientMap from './gradientmap'
import useSeed from './useseed'

const clamp = x => Math.min(1, Math.max(0, x))

const types = {
	island(x, y, g, w, h) {
		return (1 - (((x - (w / 2)) / (w / 2)) ** 2 + ((y - (h / 2)) / (h / 2)) ** 2) ** 2) * g
	},

	coast(x, y, g, w, h) {
		return clamp(g * y / (h * 0.75) + y / (h * 4))
	},

	smallIslands(x, y, g, w, h) {
		const edgeFade = clamp(x / (w / 16)) * clamp((w - x) / (w / 16)) * clamp(y / (h / 16)) * clamp((h - y) / (h / 16))
		return g ** 1.5 * edgeFade
	}
}

export default ({ x, y, type, scale = 4, ...props }) => {
	const seed = useSeed(x, y)

	return <Canvas draw={(ctx, canvas) => {
		const { width, height } = canvas
		const noise = new Simplex2(seed)

		const data = new Uint8ClampedArray(width * height * 4)

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const i = (x + y * width) * 4
				const n = (noise.octavate(scale, x / (width / 4), y / (height / 4)) + 1) / 2
				const g = Math.floor(256 * types[type](x, y, n, width, height))

				data[i] = g
				data[i + 1] = g
				data[i + 2] = g
				data[i + 3] = 255
			}
		}

		const image = new ImageData(data, width, height)
		const mapped = gradientMap(image, {
			0: '#fff1e5',
			0.485: '#fff1e5',
			0.5: '#999189',
			0.515: '#f2dfce',
			1: '#fffcfa',
		})

		ctx.putImageData(mapped, 0, 0);

	}} {...props} />
}