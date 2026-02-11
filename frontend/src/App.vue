<script setup lang="ts">

import { ref, computed, watch, onMounted } from 'vue';
import usePositions from './composables/usePositions';
import useGame from './composables/useGame';

const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

const { gridTiles, generateGrid, updateRobotView, moveRobot, turnRobot } = useGame();

// reference to robot character tile
let robot: HTMLElement | null;
let arrow: HTMLElement | null;

const currentPosition = ref({x:0,y:0,f:''});
const GRID_SIZE = 5;

// This will show 'Report' when the player is not on the board, and will show their current co-ordinates and direction if they are on the board
const report = computed(() => {
  return currentPosition.value.f == 'notPlaced' ? 'Report' : `${currentPosition.value.x}, ${currentPosition.value.y}, ${currentPosition.value.f} ` 
});



/**
 * When grid tiles are clicked, this handler allows access to the grid row, grid column, as well as x and y coordinates to place the robot both on the grid with topleft being 1,1 and in its own coordinate system with bottom left being 0,0
 * @param event The grid tile that is clicked on
 */
const gridTileClick = (event: any) => {

  const clickData = event.target.dataset;

  console.log(clickData.x, clickData.y, clickData.row, clickData.col);

  // The robot's coordinates are tracked by x and y,
  // however to place the robot on the grid it needs
  // to use the CSS Grid row/col coordinates.
  if (robot){
    robot.style.gridColumn = clickData.col;
    robot.style.gridRow = clickData.row;

    if (robot.style.visibility == 'hidden')
    robot.style.visibility = 'visible';
  }

  // Update the player's tracked x and y coordinates
  // If the player has not been placed on the board yet,
  // place it at this click location and facing North
  if(currentPosition.value.f == 'notPlaced') {

    currentPosition.value = {
      x: clickData.x,
      y: clickData.y,
      f: 'North'
    };

    if (arrow){
      arrow.classList.add(currentPosition.value.f);
    }
  }
  // If the player is already on the board, update x and y without changing arrow
  else {
    currentPosition.value.x = clickData.x;
    currentPosition.value.y = clickData.y;
  }
  
  console.log('saving click placed position', currentPosition.value);
  saveCurrentPosition(currentPosition.value)
}

const turnLeft = () => {
  turnRobot(arrow, -1, currentPosition);
  console.log('saving turn left position', currentPosition.value);
  saveCurrentPosition(currentPosition.value)
}

const turnRight = () => {
  turnRobot(arrow, 1, currentPosition);
  console.log('saving turn right position', currentPosition.value);
  saveCurrentPosition(currentPosition.value)
}

const moveForward = () => {

  const newPosition = moveRobot(currentPosition.value, GRID_SIZE);

  if (newPosition){

    console.log('saving move position', currentPosition.value);
    saveCurrentPosition(currentPosition.value)

    // console.log('newposition', newPosition)
    currentPosition.value.x = newPosition.x;    currentPosition.value.y = newPosition.y;
    updateRobotView(robot, arrow, currentPosition, GRID_SIZE)
  }

}


// Initial setup on mount
onMounted(async () => {

  // get references to the robot-tile and arrow elements to move them 
  robot = document.getElementById('robot-tile');
  arrow = document.getElementById('arrow');

  // generate a grid of size GRID_SIZE x GRID_SIZE
  generateGrid(GRID_SIZE);

  // Retrieve last saved position from database
  currentPosition.value = await getLatestPosition();

  // place the robot visually if there is a position
  if (currentPosition.value.f == 'notPlaced') {
    console.log('there is no latest position and the robot will not be on the board');
  }
  else {
    console.log('there is a latest position and the robot will be assigned it')
    updateRobotView(robot, arrow, currentPosition, GRID_SIZE);
  }

  // add keydown events for the arrow keys to trigger the same movement handlers that the buttons activate
  document.addEventListener('keydown', (event) => {
    if(event.code == 'ArrowLeft')
      turnLeft();
    if(event.code == 'ArrowRight')
      turnRight();
    if(event.code == 'ArrowDown' || event.code == 'ArrowUp')
      moveForward();
  })

  // Debug info - this can be deleted
  console.log('app.vue log latestposition is ', currentPosition.value);

  

  

});

</script>

<template>

  <!-- Main Viewspace -->
  <div class="game-window">
    <div class="container">
      <div class="instructions">Click to place the robot, use the buttons or arrows to move</div>

      <!-- Main Grid  -->
      <div class="grid">

        <!-- Player Robot Character -->
        <div id="robot-tile" style="visibility: hidden;">
          <div id="robot">
            <div id="robot-head">
              <div class="robot-eye"></div>
              <div class="robot-eye"></div>
            </div>
            <div id="robot-body"></div>
          </div>
          <div id="arrow" class="">></div>
        </div>

        <!-- Grid Tiles -->
        <div 
          v-for="gridTile in gridTiles" 
          :key="gridTile.id"
          :data-x="gridTile.x" 
          :data-y="gridTile.y" 
          :data-row="gridTile.row" 
          :data-col="gridTile.col"  
          :style="{'grid-row': gridTile.row, 
          'grid-column': gridTile.col}"
          @click="gridTileClick"
          class="grid-tile">
        </div>
      </div>

      <!-- Console Area (Buttons and Output) -->
      <div class="console">
        <div class="controls">
          <button @click="turnLeft">Left</button>
          <button @click="moveForward">Move</button>
          <button @click="turnRight">Right</button>
        </div>
        <div class="output">
          <div class="report">{{ report }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
