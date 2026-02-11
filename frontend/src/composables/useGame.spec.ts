import { describe, it, expect } from 'vitest'
import useGame from './useGame'

// const { gridTiles, gridSize, moveRobot, turnRobot, updateRobotView } = useGame();

describe('useGame', () => {
    it('has a test stub (see plan below this test)', () => {
        expect(true).toBe(true);
    })
})


// TEST PLAN for useGame


/**
 *  generateGrid unit tests
 * 
 *  - check that gridTiles is empty
 * 
 *  - run generateGrid with input of 5
 * 
 *  - check that gridTiles has 25 length for 5x5 tiles
 * 
 *  - check that for a tile with row and column such as (5, 1) matches x, y coordinates (0, 0)
 * 
 *  - check that all gridIDs are unique (hardens against regressions)
 * 
 *  - check with size 3, 10 and verify that length, co-ordinate maps, work on each size
 * 
 *  - check with input of 0 or negative to be sure that errors stated for graceful handling
 * 
 */

/**
 * moveRobot unit tests
 * 
 *  - check its inputs vs its outputs:
 * 
 *  - check that giving it currentposition x 0, y 0, f 'North' results in x 0 y 1 f 'North' return value
 * 
 *  - check that giving it currentposition x 0, y 0, f 'South' results in x 0 y 0 f 'South' return value
 * 
 *  - repeat for steps that would take it a value that is >= the gridSize so that the max x,y is always gridSize-1
 * 
 *  - repeat for steps that make sure that x,y is always at least 0
 * 
 */

/**
 * turnRobot unit tests
 * 
 * pass in a reference to an HTML element with a class hook * of 'North' and check that repeatedly calling
 * different left, right combinations updates the HTMLElement's class hooks to what is expected
 * 
 */



/**
 * updateRobotView unit tests
 * 
 *  - check that for a few given x,y,f position inputs the correct row,col,activeClassHook come out as expected
 * 
 */



