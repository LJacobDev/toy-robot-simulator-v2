<script setup lang="ts">

import { ref, onMounted } from 'vue';
import usePositions from './composables/usePositions';

const placed = ref(false);


const { getLatestPosition, saveCurrentPosition, deleteAllPositions } = usePositions();

onMounted( async () => {

  const latestPosition = await getLatestPosition();

  console.log('app.vue log latestposition is ', latestPosition);

  if (latestPosition) {
    console.log( 'there is a latest position and the robot will be assigned it')
    placed.value = true;

  }
  else {
    console.log('there is no latest position and the robot will not be on the board');
  }

  
  console.log("saving current position 0 0 North...");
  saveCurrentPosition({x:0, y:0, f: 'North'});


  console.log("reloading positions returns: ", await getLatestPosition());

  console.log("deleting all position...");
  deleteAllPositions();

  console.log("reloading positions returns: ", await getLatestPosition());


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
    </div>
  </div>

</template>

<style scoped>




</style>
