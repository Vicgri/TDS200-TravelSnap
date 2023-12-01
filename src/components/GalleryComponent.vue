<script setup lang="ts">
import {db} from "@/main";

import { getDocs,collection } from 'firebase/firestore/lite';
const travelCollectionRef = collection(db, "travel")
import {ref} from "vue";
const allTravels = ref([]);
const fetchTravel = async () => {
  try{

    // Get the document
    const docSnap = await getDocs(travelCollectionRef);
    // Access the document's data
    if (!docSnap.empty) {
      allTravels.value = docSnap.docs.map((doc) => doc.data)
    } else {
      console.log("No such document!");
    }
  } catch(error) {
    console.error("Error fetching the camping spot", error)
  }

}
fetchTravel()
console.log(allTravels.value)
</script>

<template>
                         <h1>IT WORKS</h1>
</template>

<style scoped>

</style>