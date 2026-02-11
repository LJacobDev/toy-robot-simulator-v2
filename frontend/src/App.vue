<script setup lang="ts">

import { onMounted } from 'vue';
import usePositions from './composables/usePositions';

const { getLatestPosition } = usePositions();

onMounted( async () => {

  const latestPosition = await getLatestPosition();

  if (latestPosition) {
    console.log('there is a latest position and the robot will be assigned it')
  }
  else {
    console.log('there is no latest position and the robot will not be on the board');
  }

  
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
