import sample from '../public/building.json'
import type { BuildingData } from './types'

// Single source of truth: the same file users can download as a JSON example.
export const SAMPLE_BUILDING = sample as BuildingData
