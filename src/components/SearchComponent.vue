const q = query(collection(db, "travel"), where("title", "==", true));

const querySnapshot = (async () => {
try {
const searchSnapshot = await getDocs(collection(db, "travel"));
searchSnapshot.forEach((doc) => {
return ({id: doc.id, ...doc.data()});
})
}

<script>

</script>

<template>
  <li v-for="result in searchResults" :key="result.id">{{ result.name }}</li>
</template>