<script lang="ts">

import { db } from "@/main";
import { collection, query, where, getDocs } from "firebase/firestore"
import { NewTravelSnap } from "@/models/TravelSnapModel";
import GalleryComponent from "@/components/GalleryComponent.vue";
import {IonInput, IonItem, IonButton} from "@ionic/vue";



export const getTravels = async (searchTerm: string) => {
  const travels = query(collection(db, 'travel'), where('title', '==', searchTerm)); // Query Firestore for travels with a matching title
  const querySnapshot = await getDocs(travels);
  return querySnapshot.docs.map((doc) => doc.data()) as NewTravelSnap[];            // Map and return the data from the query snapshot as NewTravelSnap array
};


export default {
  components: { IonItem, IonInput, GalleryComponent, IonButton },
  data() {
    return {
      searchTerm: '',                               // State to store the search term
      searchResults: [] as NewTravelSnap[],         // State to store the search results
      errorMessage: '',                             // Added error message state to handle search errors
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
        <ion-input aria-label="search" v-model="searchTerm"></ion-input>
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

<style scoped>
.search-input,
.error-message {
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  padding-left: 20px;
}

ion-button {
  --background: #352d16;
  margin-top: 15px;
  height: 20px;
  border-radius: 30px; 
  overflow: hidden;
}

.rounded{
  border-radius: 30px;
}

.error-message {
  font-size: 14px;
}

</style>