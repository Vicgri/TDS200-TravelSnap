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
    router.replace('/tabs/gallery');
  } catch (error) {
    console.log("error with signing up", error.message)
  }
}

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
    <ion-content>

       <ion-grid class="ion-no-padding">        
         <ion-row>                              
           <ion-col class="ion-text-center">    
    <ion-segment value="default">
      <ion-segment-button value="default">
        <ion-label>Log In</ion-label>
      </ion-segment-button>
      <ion-segment-button value="segment">
        <ion-label>Sign Up</ion-label>
      </ion-segment-button>
    </ion-segment>




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
            </ion-col>
           </ion-row>
          </ion-grid>
       </ion-content>
     </ion-page>
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