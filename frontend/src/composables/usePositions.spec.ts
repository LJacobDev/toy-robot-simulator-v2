import { describe, it, expect } from 'vitest'
import usePositions from './usePositions'

const { getLatestPosition } = usePositions();

describe('getLatestPosition', () => {

    it('Fetches a value from API', async () => {
        
        const result = await getLatestPosition();

        expect(result).toBeDefined();
        
    })
})