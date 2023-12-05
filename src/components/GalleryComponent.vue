<script setup lang="ts">
import { IonCard, IonCardHeader, /*IonCardSubtitle,*/ IonCardTitle, IonCardContent } from "@ionic/vue";
import TravelSnapImage from "../components/TravelSnapImage.vue";

interface Props {
  id: string;
  imageUrls: string[];
	title: string;
  hashtags: string[];
}

defineProps<Props>();

</script>

<template>
	<ion-card :router-link="'/detail/' + id">

		<div v-for="(image, index) in imageUrls" :key="index">
			<TravelSnapImage :image-url="image" />
		</div>

		<ion-card-header>
			<!--<ion-card-subtitle>{{ spot.hashtags }}</ion-card-subtitle>-->
			<ion-card-title>{{ title }}</ion-card-title>
		</ion-card-header>

		<ion-card-content>
			{{ hashtags }}
		</ion-card-content>

	</ion-card>
</template>

<style scoped>

</style>