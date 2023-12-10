<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import TravelSnapImage from "../components/TravelSnapImage.vue";

interface Props {
  id: string;
  imageUrls: string[];
  title: string;
}

defineProps<Props>();
</script>

<template>
  <ion-card :router-link="'/detail/' + id">
    <div v-for="(image, index) in imageUrls" :key="index">
      <TravelSnapImage :image-url="image" />
    </div>

    <ion-card-header>
      <ion-card-title>{{ title }}</ion-card-title>
    </ion-card-header>
  </ion-card>
</template>

<style scoped>
</style>
