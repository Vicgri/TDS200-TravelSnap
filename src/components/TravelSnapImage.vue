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
  width: 100%;
  object-fit: cover;
  display: block;
}
</style>