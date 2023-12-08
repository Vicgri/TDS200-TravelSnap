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
          <ul>
            <li v-for="result in searchResults" :key="result.id">
              <div v-for ="(value, field) in result">
               {{ field }}:{{ value }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ion-content>
</template>

<script lang="ts">import { db } from "@/main";
import { collection, query, where, getDocs } from "firebase/firestore"

export const getTravels = async (searchTerm: string) => {
  const q = query(collection(db, 'travel'), where('title', '==', searchTerm));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

export default {
  data() {
    return {
      searchTerm: '',
      searchResults: [] as any[],
    };
  },
  methods: {
    async search() {
      this.searchResults = await getTravels(this.searchTerm);
    },
  },
};



</script>
