import React from 'react'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'

import Tile from './tile'

export default {
	title: 'Tile',
	decorators: [withKnobs],
}

export const tile = () => <Tile />

export const testStory = () => 'test'