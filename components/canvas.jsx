import React, { useCallback } from 'react'

export default ({ draw, width, height, ...props }) => {
	const canvasRef = useCallback(canvas => {
		if (canvas) {
			canvas.width = width;
			canvas.height = height
			draw(canvas.getContext('2d'), canvas)
		}
	}, [draw, height, width])

	return <canvas ref={canvasRef} {...props} />
}