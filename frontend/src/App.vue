<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import usePositions from './composables/usePositions';

const placed = ref(false);
const currentPosition = ref(undefined);

// This will show 'Report' when the player is not on the board, and will show their current co-ordinates and direction if they are on the board
const report = computed(()=>{
  return placed.value ? `${currentPosition.value.x}, ${currentPosition.value.y}, ${currentPosition.value.f} ` : 'Report'
});

const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

onMounted( async () => {

  currentPosition.value = await getLatestPosition();

  console.log('app.vue log latestposition is ', currentPosition.value);

  if (currentPosition.value) {
    console.log( 'there is a latest position and the robot will be assigned it')
    placed.value = true;

  }
  else {
    console.log('there is no latest position and the robot will not be on the board');
  }

  


});

</script>

<template>
  <div class="game-window">
    <div class="container">
      <div class="instructions">Click to place the robot, use the buttons or arrows to move</div>
      <div class="grid">
          <div data-x="0" data-y="0" data-row="5" data-col="1" id="1" class="grid-tile one">0,2 (1)</div>
          <div class="grid-tile 2">1,2 (2)</div>
          <div class="grid-tile 3">2,2 (3)</div>
          <!-- //you need there to be 25 cells, so that there is no overflow -->
          <!-- so use a v-if that shows the last cell as tile if not placed and robot if placed -->
            <!-- from there it can move around -->
          <div id = "robot" class="grid-tile">
              <div id="body">
                  Body
              </div>
              <div id="arrow" class="east">></div>
          </div>
      </div>
      <div class="console">
        <div class="controls">
          <button>Left</button>
          <button>Move</button>
          <button>Right</button>
        </div>
        <div class="output">
          <div class="report">{{report}}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>




</style>
