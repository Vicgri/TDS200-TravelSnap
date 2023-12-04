<script setup lang ="ts">
import {
  IonButton,
  IonContent,
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";
import {arrowBack} from "ionicons/icons";

const router = useRouter();

const backToGallery =() => {
  router.push('/tabs/gallery')
}

const logout = async()=>{
  try {
    await authService.logout();
    localStorage.removeItem("auth_token"); // Clear any locally stored tokens or user data
    router.replace('/authentication'); // Redirect to the authentication page

  } catch(error) {
    console.error(error)
  }

}



</script>

<template>
  <ion-content>
  <div class ="back-button ion padding">
    <ion-button @click="backToGallery">
      <ion-icon :icon="arrowBack"></ion-icon>
    </ion-button>
  </div>

  <div class ="profile-section ion-padding">
    <div class ="heading ion-padding">
      <h1>Your profile</h1>
    </div>

    <div class="action-button ion-padding">
      <ion-button size="default" class="logout-button" @click="logout">Log out</ion-button>
    </div>
  </div>
  </ion-content>
</template>

<style scoped>
.heading h1 {
  font-family: "Arial Rounded MT Bold";
  font-size: 43px;
  font-weight: bolder;
  color: #352d16;
}

ion-content {
  --background: #ffffff;
}

.profile-section {
  height: 44vh;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.action-button {
  text-align: center;
  .logout-button {
    --background: #352d16;

  }
}

.back-button ion-button {
  --background: #352d16;
}
</style>