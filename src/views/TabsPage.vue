<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="login" href="/tabs/login">
          <ion-icon aria-hidden="true" :icon="logIn" />
          <ion-label>Log In</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="gallery" href="/tabs/gallery">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Gallery</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="upload" href="/tabs/upload">
          <ion-icon aria-hidden="true" :icon="star" />
          <ion-label>Upload</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/tabs/search">
          <ion-icon aria-hidden="true" :icon="search" />
          <ion-label>Search</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { logIn, search, square, star } from 'ionicons/icons';
</script>
