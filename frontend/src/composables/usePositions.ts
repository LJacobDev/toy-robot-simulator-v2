import { ref } from "vue";

const loading = ref(false);
const error = ref(null);
const placed = ref(false);
const latestPosition = ref({});


/**
 * Uses GET request to api/positions to get all positions, so that the 
 * robot's latest position can be determined 
 * 
 */
const getLatestPosition = async () => {

    let APIPath;
  
  try {

    loading.value = true;
    
    if (import.meta.env.MODE == 'production') {
      APIPath = 'api/positions';
    }
    else  {
      APIPath = 'http://localhost:3000/api/positions';
    }

    const response = await fetch(APIPath);
    const positionsJSON = await response.json();

    const lastElement = positionsJSON[positionsJSON.length - 1];

    // If there is an element in the array
    // set latestPosition to hold it,
    // also set placed to true so other commands can be used
    
    if (lastElement){
        latestPosition.value = lastElement;
        placed.value = true;
    }
    
    // if there is no latest position, it will count as though the robot has not been placed yet, and no commands will be followed until the user clicks a tile to place the robot

  }
  catch (e) {
    console.log("API fetching error: ", e);
  }
  finally {
    loading.value = false; 
  }

  return latestPosition;

};





const saveCurrentPosition = async () => {

}


export default function usePositions() {




    return {
        loading,
        error,
        getLatestPosition,
        saveCurrentPosition,
    }
}