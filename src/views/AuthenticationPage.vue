<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonInput, IonItem, IonList} from '@ionic/vue';






</script>


<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Welcome to TravelSnap</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

        <ion-toolbar>
          <ion-list>
            <ion-list-header>
              <ion-label>Log In</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-input label="Email" placeholder="Enter email address"></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Password" placeholder="Enter password"></ion-input>
            </ion-item>
          </ion-list>
        </ion-toolbar>

    </ion-content>
  </ion-page>
</template>


