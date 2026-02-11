import { describe, it, expect } from 'vitest'
import usePositions from './usePositions'

const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

describe('usePositions', () => {

    it('Performs round trip API events', async () => {

        // delete first to get a clear database
        expect(
            await deleteAllPositions()
        ).toStrictEqual({ deleted: true });

        // save a new position
        expect(
            await saveCurrentPosition({ x: 0, y: 0, f: 'North' })
        ).toStrictEqual({ saved: true });

        // check that it was saved and is retrievable
        const savedResult = await getLatestPosition()
        expect(savedResult).toBeDefined();
        expect(savedResult.x).toBe(0);
        expect(savedResult.y).toBe(0);
        expect(savedResult.f).toBe('North');

        // delete all positions again
        expect(
            await deleteAllPositions()
        ).toStrictEqual({ deleted: true });

        // check latest position to be sure there isn't one
        const deletedResult = await getLatestPosition()
        expect(deletedResult).not.toBeDefined();
    })
});