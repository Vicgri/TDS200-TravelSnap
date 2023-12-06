<script lang="ts">
import { firebaseApp } from '@/main.ts'
import {
  collection,
  query,
  where} from "firebase/firestore";
import {db} from "@/main";
import {getDocs} from "firebase/firestore/lite";
import {querySnapshot} from "@firebase/firestore/dist/firestore/test/util/api_helpers";
import {defineComponent} from "vue";

export default defineComponent({
  methods: {querySnapshot}
})


const travelCollectionRef = collection(db, "travel")

const q = query(travelCollectionRef, where("title", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});
</script>

<template>
  <ion-input type="text" [(ngModel)]="searchQuery" placeholder="Search by title or hashtag"></ion-input>
  <ion-list>
    <ion-item *ngFor="let travelItem of travelItems">
      <ion-label>
        <h2>{{ querySnapshot.title }}</h2>
      </ion-label>
    </ion-item>
  </ion-list>
</template>