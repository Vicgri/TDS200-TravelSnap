<template>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>
        <input v-model="searchTerm" />
        <button @click="search">Search</button>
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
      </div>
    </ion-content>
</template>

<script lang="ts">import { db } from "@/main";
import { collection, query, where, getDocs } from "firebase/firestore"
import { NewTravelSnap } from "@/models/TravelSnapModel";
import {ref} from "vue/dist/vue";
import GalleryComponent from "@/components/GalleryComponent.vue";

export const getTravels = async (searchTerm: string) => {
  const q = query(collection(db, 'travel'), where('title', '==', searchTerm));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data())as NewTravelSnap [];
};

export default {
  components: {GalleryComponent},
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
