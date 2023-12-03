<script setup lang="ts">
import {
  IonButton,
  IonContent ,
  IonInput,
  IonItem,
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";
import {arrowBack} from "ionicons/icons";

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

const backToLogin =() => {
  router.replace('/authentication')
}
</script>

<template>
  <ion-content>

    <div class ="back-button ion padding">
      <ion-button @click="backToLogin">
        <ion-icon :icon="arrowBack"></ion-icon>
      </ion-button>
    </div>

    <div class ="signup-section ion-padding">
      <div class ="heading ion-padding">
        <h1>Create an Account</h1>
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
        <ion-button size="default" class="signup-button" @click="signUp">Sign Up</ion-button>
        </div>
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

.signup-section {
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
.signup-form  {
  width: 100%;
}

ion-input {
  --ion-text-color: #f8f8e5;;
}


.signup-form ion-label,
.signup-form ion-input {
  color: #f8f8e5;

}
.action-button {
  text-align: center;
  .signup-button {
    --background: #352d16;

  }
}

.back-button ion-button {
  --background: #352d16;
}

</style>