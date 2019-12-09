import { createContext, useContext, useMemo } from 'react'
import { Simplex2 } from 'tumult'

export const Seed = createContext()

export default () => {
	const seed = useContext(Seed)
	return useMemo(() => new Simplex2(seed), [seed])
}
