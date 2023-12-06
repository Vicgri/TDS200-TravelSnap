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


const router = useRouter()

const signupPage = () => {
  try {
    router.push('/signup')
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
    await authService.login(userDetails.value.email, userDetails.value.password);
    console.log("login successful")
    router.push('/tabs/gallery');
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
        <ion-button size="default" class="login-button" @click="login">Log in</ion-button>
        <p>or</p>
        <ion-button class="signup-button" size="default" @click="signupPage">Sign Up</ion-button>

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
    margin-right: 20px;
}
  p {
    color: #352d16
  }


</style>