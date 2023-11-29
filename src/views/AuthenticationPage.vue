<script setup lang="ts">
import { IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonInput, IonItem, IonList} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
// import { getFirestore, collection } from "firebase/firestore"
import { ref } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()

const userDetails = ref ({
  firstName: "",
  email: "",
  password: "",
});
// const userCollection = collection(getFirestore(), "users")

const login = async () => {
  try {
    await authService.login(userDetails.value.email, userDetails.value.password);
    console.log("login successful")
    router.replace('/tabs/gallery');
  }
  catch (error) {
    console.error("error with login", error.message)
  }
}

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
              <ion-label label="Email" placeholder="Enter email address"></ion-label>
              <ion-input type="email" v-model="userDetails.email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label label="Password" placeholder="Enter your password"></ion-label>
              <ion-input type="password" v-model="userDetails.password"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button @click="login" class="auth-btn">Log in</ion-button>
        </ion-toolbar>

    </ion-content>
  </ion-page>
</template>


