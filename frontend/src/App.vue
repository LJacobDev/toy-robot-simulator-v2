<script setup lang="ts">

import { onMounted } from 'vue';

onMounted( async () => {

  let latestPosition = {};
  
  try {
    const response = await fetch('http://localhost:3000/api/positions');
    const positionsJSON = await response.json();
    latestPosition = positionsJSON[positionsJSON.length - 1];
    console.log("the latest position is ", latestPosition) 
    console.log("the position array is ", positionsJSON) 

  }
  catch (e) {
    console.log("API fetching error: ", e);
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
