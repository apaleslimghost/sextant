import { createContext, useContext, useMemo } from 'react'
import Simplex2 from './noise/simplex2'

export const Seed = createContext()

export default () => {
	const seed = useContext(Seed)
	return useMemo(() => new Simplex2(seed), [seed])
}
