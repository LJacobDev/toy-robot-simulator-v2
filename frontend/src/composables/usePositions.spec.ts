import { describe, it, expect } from 'vitest'
import usePositions from './usePositions'

const { getLatestPosition } = usePositions();

describe('getLatestPosition', () => {

    it('Performs round trip API events', async () => {
        
        const result = await getLatestPosition();

        console.log('latest position value', result)

        expect(result).toBeDefined();
        
    })
})