const gridTiles: { id: number; row: number; col: number; x: number; y: number; }[] = [];

/**
 * Generates an array that represents the grid tiles and their co-ordinate data
 * @param gridSize - should be an integer that sets how many tiles wide (and tall) the square grid should be
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


export default function useGame() {

    return {
        gridTiles,
        generateGrid
    }
}