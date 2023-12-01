<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="search" href="/tabs/search">
          <ion-icon aria-hidden="true" :icon="search" />
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="gallery" href="/tabs/gallery">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Gallery</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="upload" href="/tabs/upload">
          <ion-icon aria-hidden="true" :icon="star" />
          <ion-label>Upload</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon aria-hidden="true" :icon="woman" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import {logIn, search, square, star, woman} from 'ionicons/icons';
</script>
