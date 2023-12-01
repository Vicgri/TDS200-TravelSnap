<script setup lang="ts">
import { IonCard, IonCardHeader, /*IonCardSubtitle,*/ IonCardTitle, IonCardContent } from "@ionic/vue";
import TravelSnapImage from "../components/TravelSnapImage.vue";

interface Props {
	travel: {
		id: number;
		title: string;
		description: string;
		//hashtags: string[];
		imageUrls: string[];
		//comments: string[]
	}
}

defineProps<Props>();

</script>

<template>
	<ion-card :router-link="'/detail/' + travel.id">

		<div v-for="(image, index) in travel.imageUrls" :key="index">
			<TravelSnapImage :image-url="image" />
		</div>

		<ion-card-header>
			<!--<ion-card-subtitle>{{ spot.hashtags }}</ion-card-subtitle>-->
			<ion-card-title>{{ travel.title }}</ion-card-title>
		</ion-card-header>

		<ion-card-content>
			{{ travel.description }}
		</ion-card-content>

	</ion-card>
</template>