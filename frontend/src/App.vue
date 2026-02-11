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
  <h1>Test output</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
