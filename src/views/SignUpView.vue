<script setup lang="ts">
import {
  IonSegment,
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent ,
  IonInput,
  IonItem,
  IonList,
  IonSegmentButton,
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()

const userDetails = ref ({
  firstName: "",
  email: "",
  password: "",
});

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

const signUp = async () => {
  try {
    await authService.signUp(userDetails.value.email, userDetails.value.password);
    await login()
    router.replace('/tabs/gallery');
  } catch (error) {
    console.log("error with signing up", error.message)
  }
}
</script>

<template>
  <ion-content>
    <div class ="login-section ion-padding">
      <div class ="heading ion-padding">
        <h1>Create an Account</h1>
      </div>
    </div>
      <div class="signup-form ion-padding">
        <div class ="form-input">
          <ion-icon name="name"></ion-icon>
          <ion-item>
            <ion-label position="floating">First Name</ion-label>
            <ion-input type="text" v-model="userDetails.firstName"></ion-input>
          </ion-item>

        <div class ="form-input">
          <ion-icon name="mail"></ion-icon>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input type="email" v-model="userDetails.email"></ion-input>
          </ion-item>
        </div>

        <div class="form-input">
          <ion-icon name="lock-closed"></ion-icon>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" v-model="userDetails.password"></ion-input>
          </ion-item>
        </div>
      </div>
      <div class="action-button ion-padding">
        <ion-button size="small" class="login-button" @click="signUp">Sign Up</ion-button>
        </div>
    </div>
  </ion-content>
</template>


<style scoped>
ion-content {
  --background: linear-gradient(#465b6d, #f3a5a1);

}
</style>