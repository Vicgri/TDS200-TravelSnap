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

</script>


<template>
    <ion-content>
    <div class ="login-section ion-padding">
      <div class ="heading ion-padding">
      <h1>TravelSnap</h1>
        <p>Please log in to access the gallery.</p>
      </div>

    <div class="login-form ion-padding">
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
        <ion-button size="large" class="login-button" @click="login">Log in</ion-button>

        <ion-button class="signup-button" size="large" router-direction="forward">Sign up</ion-button>


      </div>


    </div>



       </ion-content>
</template>



<style scoped>
ion-content {
  --background: linear-gradient(#465b6d, #f3a5a1);

  
                          
}

ion-segment-button{
--ion-background-color: #f8f8e5;
--ion-text-color: #352d16;
//--indicator-color: #f8f8e5;
--color-checked: #352d16;
//--background-checked: #352d16;
--border-radius: 10px;
--margin-top: 5px;
--margin-bottom: 5px;

}

ion-list {

}
</style>