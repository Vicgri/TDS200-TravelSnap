<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  onIonViewDidEnter,
} from "@ionic/vue";
import GalleryComponent from "@/components/GalleryComponent.vue";
import { db } from "@/main";
import { getDocs, collection } from "firebase/firestore";

const travelCollectionRef = collection(db, "travel");
import { ref } from "vue";
import { NewTravelSnap } from "@/models/TravelSnapModel";
onIonViewDidEnter(async () => {
  fetchTravels();
});

const allTravels = ref<NewTravelSnap[]>([]);

const fetchTravels = async () => {
  try {
    // Get the document
    const docSnap = await getDocs(travelCollectionRef);
    // Access the document's data
    if (!docSnap.empty) {
      allTravels.value = docSnap.docs.map((doc) =>
        doc.data()
      ) as NewTravelSnap[];
    } else {
      console.log("No document!");
    }
  } catch (error) {
    console.error("Error fetching travel", error);
  }
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col
            v-for="travel in allTravels"
            :key="travel.id"
            size="12"
            size-md="6"
            size-lg="4"
          >
            <ion-card>
              <GalleryComponent
                :id="travel.id"
                :title="travel.title"
                :image-urls="travel.imageUrls"
              />
              <ion-chip-group>
                <ion-chip
                  v-for="hashtag in travel.hashtags"
                  :key="hashtag"
                  class="hashtag"
                >
                  {{ hashtag }}
                </ion-chip>
              </ion-chip-group>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style>
.hashtag {
  --ion-background-color: #f2f2f2; 
  --ion-color: #666; 
  margin-right: 8px;
  font-size: 0.9rem;
}
</style>
