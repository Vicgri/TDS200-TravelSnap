<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/vue";
import TravelSnapImage from "../components/TravelSnapImage.vue";
import { NewTravelSnap } from "@/models/TravelSnapModel";

interface Props {
	travel: NewTravelSnap
}

defineProps<Props>();

</script>

<template>
	<ion-card :router-link="'/detail/' + travel.id">

		<div v-for="(image, index) in travel.imageUrls" :key="index">
			<TravelSnapImage :image-url="image" />
		</div>

		<ion-card-header>
			<ion-card-title>{{ travel.title }}</ion-card-title>
		</ion-card-header>

		<ion-card-content>
			{{ travel.description }}
		</ion-card-content>

	</ion-card>
</template>