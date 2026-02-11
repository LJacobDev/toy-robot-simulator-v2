<script setup lang="ts">

import { ref, computed, watch, onMounted } from 'vue';
import usePositions from './composables/usePositions';
import useGame from './composables/useGame';

const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

const { gridTiles, generateGrid } = useGame();

// reference to robot character tile
let robot: HTMLElement | null;
let arrow: HTMLElement | null;

const currentPosition = ref({x:0,y:0,f:''});
const GRID_SIZE = 5;

// This will show 'Report' when the player is not on the board, and will show their current co-ordinates and direction if they are on the board
const report = computed(() => {
  return currentPosition.value.f == 'notPlaced' ? 'Report' : `${currentPosition.value.x}, ${currentPosition.value.y}, ${currentPosition.value.f} ` 
});


watch(currentPosition, async (newPosition, oldPosition) => {
  if(newPosition.f != 'notPlaced')
    saveCurrentPosition(newPosition);
})


/**
 * When grid tiles are clicked, this handler allows access to the grid row, grid column, as well as x and y coordinates to place the robot both on the grid with topleft being 1,1 and in its own coordinate system with bottom left being 0,0
 * @param event The grid tile that is clicked on
 */
const gridTileClick = (event: any) => {

  const clickData = event.target.dataset;

  console.log(
    clickData.x, 
    clickData.y,
    clickData.row, 
    clickData.col,
  );

  // The robot's coordinates are tracked by x and y,
  // however to place the robot on the grid it needs
  // to use the CSS Grid row/col coordinates.
  if (robot){
    robot.style.gridColumn = clickData.col;
    robot.style.gridRow = clickData.row;

    if (robot.style.visibility != 'visible')
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
  
}

const turnLeft = () => {
  if (currentPosition.value.f == 'notPlaced')
    return;

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

    console.log(arrow?.classList.value == 'North');
}

const turnRight = () => {
  if (currentPosition.value.f == 'notPlaced')
    return;
  
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

const moveForward = () => {
  if (currentPosition.value.f == 'notPlaced')
    return;
  
    switch(arrow?.classList.value) {
      case 'North': {
          moveRobot(0,1);
        break;
      }
      case 'East': {
          moveRobot(1,0);
        break;
      }  
      case 'South': {
          moveRobot(0,-1);
        break;
      }  
      case 'West': {
          moveRobot(-1,0);
        break;
      }
    }

}

/**
 * Moves the tracked coordinates of the robot and updates the grid row and column styles of the robot element.  If the move will take the robot out of bounds it is ignored.
 * 
 * @param x use 1 to move to the right, -1 to move to the left
 * @param y use 1 to move up, -1 to move down
 */
const moveRobot = (x: number, y: number) => {

  if(x != 0) {
    if(+currentPosition.value.x + x >= GRID_SIZE || +currentPosition.value.x + x < 0)
      return;
  }
   
  if(y != 0) {
    if(+currentPosition.value.y + y >= GRID_SIZE || +currentPosition.value.y + y < 0)
      return;
  }
  
  currentPosition.value.x = +currentPosition.value.x + x;
  currentPosition.value.y = +currentPosition.value.y + y;

  if (robot){
    console.log(robot.style.gridColumn);
    robot.style.gridColumn = String(+robot.style.gridColumn + x);
    robot.style.gridRow = String(+robot.style.gridRow - y);
  }
}





onMounted(async () => {

  // get references to the robot-tile and arrow elements to move them 
  robot = document.getElementById('robot-tile');
  arrow = document.getElementById('arrow');

  // generate a grid of size 5 x 5
  generateGrid(GRID_SIZE);

  currentPosition.value = await getLatestPosition();

  console.log('app.vue log latestposition is ', currentPosition.value);

  if (currentPosition.value.f == 'notPlaced') {
    console.log('there is no latest position and the robot will not be on the board');
  }
  else {
      console.log('there is a latest position and the robot will be assigned it')
  }


  document.addEventListener('keydown', (event) => {
    if(event.code == 'ArrowLeft')
      turnLeft();
    if(event.code == 'ArrowRight')
      turnRight();
    if(event.code == 'ArrowDown' || event.code == 'ArrowUp')
      moveForward();
  })

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
            <!-- {{ gridTile.x }},
            {{ gridTile.y }} -->
          </div>
      </div>

      <!-- Console Area (Buttons and Output) -->
      <div class="console">
        <div class="controls">
          <button @click="turnLeft">Left</button>
          <button @click="moveForward">Move</button>
          <button @click="turnRight">Right</button>
          <!-- <button >Left</button>
          <button >Move</button>
          <button >Right</button> -->
        </div>
        <div class="output">
          <div class="report">{{ report }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
