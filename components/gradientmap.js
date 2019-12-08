export default (canvas, gradientStops) => {
	const gradientCanvas = document.createElement('canvas')
	gradientCanvas.width = 255
	gradientCanvas.height = 1

	const gradientCtx = gradientCanvas.getContext('2d')
	const gradient = gradientCtx.createLinearGradient(0, 0, 255, 0)
	for (const stop in gradientStops) {
		if (Object.prototype.hasOwnProperty.call(gradientStops, stop)) {
			gradient.addColorStop(stop, gradientStops[stop])
		}
	}

	gradientCtx.fillStyle = gradient
	gradientCtx.fillRect(0, 0, 255, 1)

	const gradientData = gradientCtx.getImageData(0, 0, 255, 1).data

	const { width, height } = canvas
	const ctx = canvas.getContext('2d')
	const canvasData = ctx.getImageData(0, 0, width, height)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (x + y * width) * 4
			const g = canvasData.data[i] * 4

			canvasData.data[i] = gradientData[g]
			canvasData.data[i + 1] = gradientData[g + 1]
			canvasData.data[i + 2] = gradientData[g + 2]
			canvasData.data[i + 3] = gradientData[g + 3]
		}
	}

	ctx.putImageData(canvasData, 0, 0)
}
