import React from 'react'
import Canvas from './canvas'
import { Simplex2 } from 'tumult'

const gradientCanvas = document.createElement('canvas')
gradientCanvas.width = 255
gradientCanvas.height = 1

const gradientCtx = gradientCanvas.getContext('2d')
const gradient = gradientCtx.createLinearGradient(0, 0, 255, 0)
gradient.addColorStop(0, 'blue')
gradient.addColorStop(0.5, 'blue')
gradient.addColorStop(0.501, 'green')
gradient.addColorStop(1, 'green')

gradientCtx.fillStyle = gradient
gradientCtx.fillRect(0, 0, 255, 1)

const gradientData = gradientCtx.getImageData(0, 0, 255, 1).data

export default ({ }) => <Canvas draw={(ctx, canvas) => {
	const noise = new Simplex2('seed')
	const { width, height } = canvas

	const data = new Uint8ClampedArray(width * height * 4)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (x + y * width) * 4
			const n = noise.octavate(5, x / 100, y / 100)
			const g = (128 + Math.floor(128 * n)) * 4

			data[i] = gradientData[g]
			data[i + 1] = gradientData[g + 1]
			data[i + 2] = gradientData[g + 2]
			data[i + 3] = 255
		}
	}

	const image = new ImageData(data, width, height)
	ctx.putImageData(image, 0, 0)
}} width={400} height={400} />