<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import usePositions from './composables/usePositions';
import useGame from './composables/useGame';

const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

const { gridTiles, generateGrid } = useGame();

const placed = ref(false);
const currentPosition = ref(undefined);

// This will show 'Report' when the player is not on the board, and will show their current co-ordinates and direction if they are on the board
const report = computed(() => {
  return placed.value ? `${currentPosition.value.x}, ${currentPosition.value.y}, ${currentPosition.value.f} ` : 'Report'
});


const gridTileClick = (event) => {
  console.log(
    event.target.dataset.x, 
    event.target.dataset.y,
    event.target.dataset.row, 
    event.target.dataset.col,
  );
}


onMounted(async () => {

  currentPosition.value = await getLatestPosition();

  console.log('app.vue log latestposition is ', currentPosition.value);

  if (currentPosition.value) {
    console.log('there is a latest position and the robot will be assigned it')
    placed.value = true;

  }
  else {
    console.log('there is no latest position and the robot will not be on the board');
  }

  generateGrid(5);


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
        <div v-if="placed" id="robot-tile" class="grid-tile">
          <div id="robot">
            <div id="robot-head">
              <div class="robot-eye"></div>
              <div class="robot-eye"></div>
            </div>
            <div id="robot-body"></div>
          </div>
          <div id="arrow" class="east">></div>
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
