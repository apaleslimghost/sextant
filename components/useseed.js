import { createContext, useContext } from 'react'

export const Seed = createContext()

export default (x, y) => {
	const base = useContext(Seed)
	return `${base}-${x}-${y}`
}
