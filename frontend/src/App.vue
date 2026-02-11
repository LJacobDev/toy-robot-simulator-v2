<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import usePositions from './composables/usePositions';
import useGame from './composables/useGame';

const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

const { gridTiles, generateGrid } = useGame();

// reference to robot character tile
let robot: HTMLElement | null;
let arrow: HTMLElement | null;

const currentPosition = ref({x:0,y:0,f:''});

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

  console.log(
    clickData.x, 
    clickData.y,
    clickData.row, 
    clickData.col,
  );

  if(currentPosition.value.f == 'notPlaced') {
    currentPosition.value = {
      x: clickData.x,
      y: clickData.y,
      f: 'North'
    }
  }
  else {
    currentPosition.value.x = clickData.x;
    currentPosition.value.y = clickData.y;
  }
  
  
  if (robot){
    robot.style.gridColumn = clickData.col;
    robot.style.gridRow = clickData.row;

    robot.style.visibility = 'visible';
  }
  if (arrow){
    arrow.classList.add('North');
  }

}


onMounted(async () => {

  robot = document.getElementById('robot-tile');
  arrow = document.getElementById('arrow');

  generateGrid(5);

  currentPosition.value = await getLatestPosition();

  console.log('app.vue log latestposition is ', currentPosition.value);

  if (currentPosition.value.f != 'notPlaced') {
    console.log('there is a latest position and the robot will be assigned it')
  }
  else {
    console.log('there is no latest position and the robot will not be on the board');
  }



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
          class="grid-tile">{{ gridTile.x }},{{ gridTile.y }}</div>
      </div>

      <!-- Console Area (Buttons and Output) -->
      <div class="console">
        <div class="controls">
          <button>Left</button>
          <button>Move</button>
          <button>Right</button>
        </div>
        <div class="output">
          <div class="report">{{ report }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
