<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem, toastController,
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";
import { IonIcon } from '@ionic/vue';

const router = useRouter()

const signupPage = () => {
  try {
    router.replace('/signup')
  } catch (error) {
    console.error("error with signupPage")
  }
}

const userDetails = ref ({
  email: "",
  password: "",
});

const login = async () => {
  try {
    const user = await authService.login(userDetails.value.email, userDetails.value.password);
    const idToken = await user.getIdToken(true); // Retrieve and set authentication token
    localStorage.setItem("auth_token", idToken) // Store authentication token in local storage
    router.replace('/tabs/gallery');

  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Login unsuccessful. Please sign up or check if the email and password is correct.',
      duration: 3500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
  }
}// calls the method from authService

const googleLogin = async () => {
  try {
    const user = await authService.signinWithGoogle(); // Attempt Google login using authService
    const idToken = user.accessToken; // Retrieve Google access token
    localStorage.setItem("auth_token", idToken) // Store access token in local storage
    router.replace('/tabs/gallery');

  } catch (error) {
    console.error(error);
  }
}

</script>


<template>
    <ion-content>
    <div class ="login-section ion-padding">
      <div class ="heading ion-padding">
      <h1>TravelSnap</h1>
      </div>

      <!-- Form input -->
    <div class="login-form ion-padding">
      <div class ="form-input">
        <ion-icon name="mail"></ion-icon>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input aria-label="email" v-model="userDetails.email"></ion-input>
        </ion-item>
      </div>

      <div class="form-input">
        <ion-icon name="lock-closed"></ion-icon>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input  aria-label="password" v-model="userDetails.password"></ion-input>
        </ion-item>
      </div>
      </div>

      <!-- Buttons -->
      <div class="action-button ion-padding">
        <ion-button @click="googleLogin"  class="button-auth" fill="solid" color="dark" size="default">
          Google Log in
        </ion-button>
        <ion-button size="default" class="login-button ion-margin" @click="login">Log in</ion-button>
        <p>or</p>
        <ion-button class="signup-button ion-margin" size="default" @click="signupPage">Sign Up</ion-button>
      </div>
    </div>

       </ion-content>
</template>


<style scoped>
.heading h1 {
  font-family: "Arial Rounded MT Bold";
  font-size: 43px;
  font-weight: bolder;
  color: #f8f8e5;

}

ion-content {
  background: linear-gradient(#465b6d, #f3a5a1);
--background: url("@/assets/mountains.png") center bottom no-repeat;
  height: 100vh;
}

.login-section {
  height: 74vh;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;

}

ion-item {
  --border-radius: 15px;


}

.login-form  {
  width: 100%;
}


  .action-button {
    text-align: center;
  }
  .login-button,
  .signup-button,
  p {
    --background: #352d16;
    display: inline-block;
    margin-right: 15px;
    margin-left: 15px;
    font-weight: bold;
    margin-bottom: 20px;
}
  p {
    color: #352d16

  }


</style>