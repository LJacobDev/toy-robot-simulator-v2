const gridTiles: { id: number; row: number; col: number; x: number; y: number; }[] = [];

/**
 * Generates an array that represents the grid tiles and their co-ordinate data
 * @param gridSize - should be an integer that sets how many tiles wide (and tall) the square grid should be
 * 
 * It pushes the result to array `gridTiles` which is available as an export from this composable so that
 * a v-for can be run over each item and their coordinate information can be placed into data attributes of the tiles
 */
const generateGrid = (gridSize: number) => {

    let gridID = 0;

    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {

            gridID++;
            const newTile = {
                id: gridID,
                row: i,
                col: j,
                x: j - 1,
                y: gridSize - i,
            }

            gridTiles.push(newTile);
        }
    }
}


/**
 * Pass in a current position and a grid size, and the new position will be calculated as one step in the currently faced direction and returned.
 * If the current position is at the left/right/top/bottom bounds of the grid, the new position will be unchanged
 * 
 * @param currentPosition 
 * @param gridSize 
 * @returns The new position accounting for grid boundaries
 */
const moveRobotTile = (currentPosition: { x: number, y: number, f: string }, gridSize: number) => {

    // console.log('moving composable')

    //ignore movement command if robot has not been placed yet
    if (currentPosition.f == 'notPlaced')
        return;

    const movement = {
        x: 0,
        y: 0
    }

    switch (currentPosition.f) {
        case 'North': {
            movement.x = 0;
            movement.y = 1;
            break;
        }
        case 'East': {
            movement.x = 1;
            movement.y = 0;
            break;
        }
        case 'South': {
            movement.x = 0;
            movement.y = -1;
            break;
        }
        case 'West': {
            movement.x = -1;
            movement.y = 0;
            break;
        }
    }


    // If it's an x movement that would take it out of bounds,
    // return unchanged current position
    
    if (movement.x != 0) {
        if (+currentPosition.x + movement.x >= gridSize || +currentPosition.x + movement.x < 0)
            return currentPosition;
    }

    // If it's a y movement that would take it out of bounds,
    // return unchanged current position

    if (movement.y != 0) {
        if (+currentPosition.y + movement.y >= gridSize || +currentPosition.y + movement.y < 0)
            return currentPosition;
    }

    // If movement is ok, create a new position and return it.
    // The extra variable is used for clarity of intention

    const newPosition = currentPosition;

    newPosition.x = +currentPosition.x + movement.x;
    newPosition.y = +currentPosition.y + movement.y;

    return newPosition
}

/**
 * Takes a reference to the arrow of the robot and changes its class hook representing the direction it's facing so that CSS can pick up the hook and show the arrow in the corresponding direction
 * @param arrow A reference to the HTMLElement with id 'arrow'
 * @param direction -1 for left, 1 for right
 * @param currentPosition the current position
 * @returns a new direction for currentPosition.value.f to receive
 */
const turnRobot = (arrow: HTMLElement|null, direction: number, currentPosition: any) => {

    // ignore controls when robot is not on board
    if (currentPosition.value.f == 'notPlaced')
        return;
  
    // Rotate right
    if (direction == 1){
        switch(arrow?.classList.value) {
            case 'North': {
                arrow.classList.remove('North');
                arrow.classList.add('East');
                currentPosition.value.f = 'East';
                break;
            }
            case 'East': {
                arrow.classList.remove('East');
                arrow.classList.add('South');
                currentPosition.value.f = 'South';
                break;
            }
            case 'South': {
                arrow.classList.remove('South');
                arrow.classList.add('West');
                currentPosition.value.f = 'West';
                break;
            }  
            case 'West': {
                arrow.classList.remove('West');
                arrow.classList.add('North');
                currentPosition.value.f = 'North';
                break;
            }
        }
    }
    else if (direction == -1) {
        switch(arrow?.classList.value) {
            case 'North': {
                arrow.classList.remove('North');
                arrow.classList.add('West');
                currentPosition.value.f = 'West';
                break;
            }
            case 'West': {
                arrow.classList.remove('West');
                arrow.classList.add('South');
                currentPosition.value.f = 'South';
                break;
            }  
            case 'South': {
                arrow.classList.remove('South');
                arrow.classList.add('East');
                currentPosition.value.f = 'East';
                break;
            }  
            case 'East': {
                arrow.classList.remove('East');
                arrow.classList.add('North');
                currentPosition.value.f = 'North';
                break;
            }
        }
    }

    return currentPosition.value.f;
}


/**
 * Updates the visual location and orientation of the robot character to match the provided currentPosition state
 * 
 * @param robotTile A reference to the HTML element with id 'robot-tile'
 * @param arrow A reference to the HTML element with id 'arrow'
 * @param currentPosition An object holding the current position's x, y coordinates and f for direction faced
 * @param gridSize is needed so that the x,y input to row,col grid location mapping can be performed
 * 
 * Return output just to confirm for unit tests that it provided the right output
 * 
 * Takes a position object from the main game context and a reference to the HTML element of the robot-tile as well as
 * its directional arrow element, and places the robot-tile on the corresponding CSS Grid row and column points by
 * setting its css styles 'gridRow' and 'gridColumn'.  It also updates the direction in which the arrow is facing by
 * changing its active directional class hook to the new direction.
 */
const updateRobotView = (robotTile: HTMLElement|null, arrow: HTMLElement|null, currentPosition: any, gridSize: number): { row: number, col: number, activeClassHook: string } => {

    const currentViewPosition = {
        row: 0,
        col: 0,
        activeClassHook: ''
    };


    if (robotTile && arrow){


        console.log('current robot position', currentPosition.value);

        console.log(robotTile.style.gridColumn);

        // Take a given x, y of a currentposition
        // and change it into a row and column pairing
        
        const newRow = gridSize - currentPosition.value.y;
        const newCol = currentPosition.value.x + 1;
        
        robotTile.style.gridRow = String(newRow);
        robotTile.style.gridColumn = String(newCol);

        if (robotTile.style.visibility == 'hidden')
        robotTile.style.visibility = 'visible';
        
        switch(currentPosition.value.f){
            case 'North':
                arrow.classList.add('North');
                break;
            case 'East':
                arrow.classList.add('East');
                break;
            case 'South':
                arrow.classList.add('South');
                break;
            case 'West':
                arrow.classList.add('West');
                break;


        }

        console.log('new robot row/col position', newRow, newCol, arrow.classList.value)
    }
    return currentViewPosition;
}


export default function useGame() {

    return {
        gridTiles,
        generateGrid,
        moveRobotTile,
        turnRobot,
        updateRobotView
    }
}