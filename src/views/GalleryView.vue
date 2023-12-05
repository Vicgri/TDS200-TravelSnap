<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Gallery</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-for="travel in allTravels" :key="travel.id">
       <GalleryComponent :id="travel.id" :title="travel.title" :image-urls="travel.imageUrls" :hashtags="travel.hashtags"/>
      </div>
      <ExploreContainer name="Gallery" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewDidEnter } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import GalleryComponent from "@/components/GalleryComponent.vue";
import {db} from "@/main";
import { getDocs,collection } from 'firebase/firestore/lite';

const travelCollectionRef = collection(db, "travel")
import {ref} from "vue";
import { NewTravelSnap } from '@/models/TravelSnapModel';
onIonViewDidEnter(async()=>{
  fetchTravels();
})
 
const allTravels = ref <NewTravelSnap[]>([]);

const fetchTravels = async()=>{
try{
    // Get the document
    const docSnap = await getDocs(travelCollectionRef);
    // Access the document's data
    if (!docSnap.empty) {  
      allTravels.value = docSnap.docs.map((doc) => doc.data()) as NewTravelSnap[];
    } else {
      console.log("No document!");
    }
  } catch(error) {
    console.error("Error fetching travel", error)
  }
}

</script>
