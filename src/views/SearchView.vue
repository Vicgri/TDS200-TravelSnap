<template>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="search-input">
        <ion-item>
          <ion-label position="floating">Search location name</ion-label>
          <ion-input type="search" v-model="searchTerm"></ion-input>
        </ion-item>
      <ion-button @click="search" size="small">Search</ion-button>
      </div>
      <div v-if="searchResults.length">
          <ion-grid>
            <ion-row>
              <ion-col
                  v-for="result in searchResults"
                  :key="result.id"
                  size="12"
                  size-md="6"
                  size-lg="4"
              >
                <ion-card>
                  <GalleryComponent
                      :id="result.id"
                      :title="result.title"
                      :image-urls="result.imageUrls"
                  />
                  <ion-chip-group>
                    <ion-chip
                        v-for="hashtag in result.hashtags"
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
            <div v-for="result in searchResults" :key="result.id">
              <hr />
            </div>
        </div>

    </ion-content>
</template>

<script lang="ts">

import { db } from "@/main";
import { collection, query, where, getDocs } from "firebase/firestore"
import { NewTravelSnap } from "@/models/TravelSnapModel";
import GalleryComponent from "@/components/GalleryComponent.vue";
import {IonInput, IonItem} from "@ionic/vue";


export const getTravels = async (searchTerm: string) => {
    const q = query(collection(db, 'travel'), where('title', '==', searchTerm));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data()) as NewTravelSnap[];
};

export default {
  components: {IonItem, IonInput, GalleryComponent},
  data() {
    return {
      searchTerm: '',
      searchResults: [] as NewTravelSnap [],
    };
  },
  methods: {
    async search() {
      this.searchResults = await getTravels(this.searchTerm);
    },
  },
};


</script>

<style scoped>
.search-input {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  padding-top: 20px;
  padding-left: 20px;
}



</style>