<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Search</ion-title>
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

    <!-- Display error message -->
    <div class="error-message" v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </div>

    <!-- Display search results -->
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



// function to get the search for the titles from the database
export const getTravels = async (searchTerm: string) => {
  const travels = query(collection(db, 'travel'), where('title', '==', searchTerm));
  const querySnapshot = await getDocs(travels);
  return querySnapshot.docs.map((doc) => doc.data()) as NewTravelSnap[];
};


export default {
  components: { IonItem, IonInput, GalleryComponent },
  data() {
    return {
      searchTerm: '',
      searchResults: [] as NewTravelSnap[],
      errorMessage: '', // Added error message state
    };
  },
  methods: {
    async search() {
      if (!this.searchTerm.trim()) {
        this.errorMessage = 'Whoops! It seems like you forgot to enter a search term. Please try again.';
        this.searchResults = []; // Clear search results
      } else {
        this.errorMessage = ''; // Clear any previous error message

        // Perform search and update results
        this.searchResults = await getTravels(this.searchTerm);

        if (this.searchResults.length === 0) {
          this.errorMessage = 'Sorry, we couldn\'t find any matches. Please check your spelling or try a different search.';
        }
      }
    },
  },
};


</script>

<style scoped>
.search-input,
.error-message {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  padding-top: 20px;
  padding-left: 20px;
}

ion-button {
  --background: #352d16;
}


</style>