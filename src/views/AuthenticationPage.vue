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
// import { getFirestore, collection } from "firebase/firestore"
import { ref } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()

const userDetails = ref ({
  firstName: "",
  email: "",
  password: "",
});

const signUp = async () => {
  try {
    await authService.signUp(userDetails.value.email, userDetails.value.password);
    await login()
  } catch (error) {
    console.log("error with signing up", error.message)
  }
}

const login = async () => {
  try {
    await authService.login(userDetails.value.email, userDetails.value.password);
    console.log("login successful")
    router.replace('/tabs/upload');
  }
  catch (error) {
    console.error("error with login", error.message)
  }
}

</script>


<template>
  <ion-page>
    <ion-content :fullscreen="true">
    </ion-content>
  </ion-page>


    <ion-segment value="default">
      <ion-segment-button value="default">
        <ion-label color="">Log In</ion-label>
      </ion-segment-button>
      <ion-segment-button value="segment">
        <ion-label>Sign Up</ion-label>
      </ion-segment-button>
    </ion-segment>

        <ion-toolbar>
          <ion-list>
            <ion-list-header>
              <ion-label>Create an Account</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label label="Name" placeholder="Name"></ion-label>
              <ion-input type="name" v-model="userDetails.firstName"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label label="Email" placeholder="Enter email address"></ion-label>
              <ion-input type="email" v-model="userDetails.email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label label="Password" placeholder="Enter password"></ion-label>
              <ion-input type="password" v-model="userDetails.password"></ion-input>
            </ion-item>

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
          <ion-button @click="signUp" class="auth-btn">Sign up</ion-button>
        </ion-toolbar>

</template>
                //4D483B
//282625      

<style scoped>
ion-segment-button {

--indicator-color: #D5D1C4;
--color-checked: #D5D1C4;
--background-checked: #282625;
--border-radius: 10px;
  
}

ion-list {
  display: flex;
  flex-direction: column;
}
</style>