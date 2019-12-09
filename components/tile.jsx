import React from 'react'
import Canvas from './canvas'
import gradientMap from './gradient-map'
import useNoise from './use-noise'

const clamp = x => Math.min(1, Math.max(0, x))

const types = {
	ocean(x, y, g) {
		return g ** 5
	},

	island(x, y, g, w, h) {
		return (1 - (((x - (w / 2)) / (w / 2)) ** 2 + ((y - (h / 2)) / (h / 2)) ** 2) ** 2) * g
	},

	coast(x, y, g, w, h) {
		const c = g * y / (h * 0.75) + y / (h * 4)
		return c < 0.5 ? this.smallIslands(x, y, g, w, h) : c
	},

	smallIslands(x, y, g, w, h) {
		const edgeFade = clamp(x / (w / 20)) * clamp((w - x) / (w / 20)) * clamp(y / (h / 20)) * clamp((h - y) / (h / 20))
		return g ** 1.75 * edgeFade
	},

	tinyIslands(x, y, g, w, h) {
		const edgeFade = clamp(x / (w / 20)) * clamp((w - x) / (w / 20)) * clamp(y / (h / 20)) * clamp((h - y) / (h / 20))
		return g ** 3 * edgeFade
	}
}

export default React.memo(({ x: mapX, y: mapY, type, scale = 4, ...props }) => {
	const noise = useNoise()

	return <Canvas draw={(ctx, canvas) => {
		const { width, height } = canvas

		const data = new Uint8ClampedArray(width * height * 4)

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const i = (x + y * width) * 4
				const n = (noise.octavate(
					scale,
					((x + mapX * width)) / (width / 2.5),
					((y + mapY * height)) / (height / 2.5)
				) + 1) / 2
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
})