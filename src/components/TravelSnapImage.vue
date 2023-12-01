<script setup lang="ts">

interface Props {
	imageUrl: string;
}

defineProps<Props>();

</script>

<template>
	<img class="travel-image" :src="imageUrl" alt="TravelSnap Image" />
</template>

<style scoped>
.travel-image {
  width: 100%;       /* Sets the width to 100% of its container */
  object-fit: cover; /* Ensure the images resize to cover the entire area without stretching */
  display: block;    /* Removes any bottom spacing that images might have by default */
}
</style>