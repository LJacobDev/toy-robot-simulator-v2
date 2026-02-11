import { ref } from "vue";

// makes showing loading states possible
const loading = ref(false);

const APIPath = import.meta.env.MODE == 'production' ? 'api/positions' : 'http://localhost:3000/api/positions';

/**
 * Uses GET request to api/positions to get all positions, so that the 
 * robot's latest position can be determined 
 * 
 * @returns An object with shape `{x: number, y: number, f: string}` if there is a position, otherwise returns `undefined`
 *
 * Currently logs errors in the console rather than throwing
 */
const getLatestPosition = async () => {

    let latestPosition;

    try {

        loading.value = true;

        const response = await fetch(APIPath);
        const positionsJSON = await response.json();

        // set the latest position to either an existing value or keep it the same as an empty object
        latestPosition = positionsJSON[positionsJSON.length - 1] ?? latestPosition;
    }
    catch (e) {
        console.log("API fetching error: ", e);
    }
    finally {
        loading.value = false;
    }

    return latestPosition;
};




/**
 * Save the current position as a new record in the database through the API
 * 
 * @param position Pass in an object in the following shape {x: 0, y:0, f: 'North'}
 * 
 * Currently logs errors in the console rather than throwing
 */
const saveCurrentPosition = async (position: object) => {
    try {
        const response = await fetch(APIPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(position)
        })

        const json = await response.json();

        return { saved: true }

    }
    catch (e) {
        console.log("API POST error: ", e);
    }
}

/**
 * Deletes all positions in the database.  Use only if you want to clear the entire position history.
 * 
 * Currently logs errors in the console rather than throwing
 */
const deleteAllPositions = async () => {

    let results;

    try {

        const response = await fetch(APIPath, {
            method: "DELETE"
        })

        const json = await response.json();

        // console.log("delete results: ", json);
        return json;
    }
    catch (e) {
        console.log("API DELETE error: ", e);
    }
}

export default function usePositions() {

    return {
        loading,
        getLatestPosition,
        saveCurrentPosition,
        deleteAllPositions,
    }
}