<script setup lang="ts">
import {
  IonButton,
  IonContent ,
  IonInput,
  IonItem,
  toastController
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";
import {arrowBack, trashBin} from "ionicons/icons";
import { Camera, CameraResultType } from '@capacitor/camera';
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {auth} from "@/main";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as dbRef,
} from "firebase/storage"
import {
  getIdToken
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });
  if (photo.webPath) {
    userDetails.value.profilePicture = photo.webPath;
  }

};

const router = useRouter()

const userDetails = ref ({
  id: "",
  firstName: "",
  email: "",
  password: "",
  profilePicture: ""
});

const userProfileCollection = collection(getFirestore(), "users");
const login = async () => {
  try {
    const user = await authService.login(userDetails.value.email, userDetails.value.password);
    const idToken = await user?.getIdToken(true)
    localStorage.setItem("auth_token", idToken)
    console.log("login successful")
    router.replace('/tabs/gallery');
  } catch (error) {
    console.error("error with login", error.message)
  }
}
  const signUp = async () => {
    try {
      await authService.signUp(userDetails.value.email, userDetails.value.password);
      await postProfilePhoto();
      await login()
      router.replace('/tabs/gallery');
    } catch (error) {
      const errorToast = await toastController.create({
        message: 'Signing up was unsuccessful. Please try again.',
        duration: 3500,
        position: 'bottom',
        color: 'danger'
      });

      await errorToast.present();
      console.error(error);
    }
  }

const postProfilePhoto = async () => {
  if (userDetails.value.profilePicture === "") {
    alert("You must upload a profile picture!");
    return;
  }
  try {
    const generatedUUID = uuidv4();
    const imageName = new Date().getTime() + '.jpg'; // generate a unique image name
    const storageRef = getStorage();
    const imageRef = dbRef(storageRef, `profilePicture/${imageName}`);
    const response = await fetch( userDetails.value.profilePicture);
    const imageBlob = await response.blob();
    const snapshot = await uploadBytes(imageRef, imageBlob);
    const url = await getDownloadURL(snapshot.ref);
    userDetails.value.profilePicture = url; // Store the URL

    userDetails.value.id = generatedUUID;
      await setDoc(doc(userProfileCollection, generatedUUID), userDetails.value);
    const successToast = await toastController.create({
      message: 'Your profile picture is successfully uploaded!',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });

    await successToast.present();
    router.replace('/tabs/gallery');

  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Something went wrong with uploading the picture',
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
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

          <div class ="picture-input ion-padding">
            <ion-button @click="triggerCamera" class="image-picker">
              Choose profile picture
            </ion-button>
            <section v-if="userDetails.profilePicture">
              <img :src="userDetails.profilePicture" />
              <ion-button @click="() => removeImagePreview()" class="remove-image-preview">
                <ion-icon slot="icon-only" :icon="trashBin" color="danger"></ion-icon>
              </ion-button>
            </section>
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


.action-button {
  text-align: center;

  .signup-button {
    --background: #352d16;
  }
}


.remove-image-preview,
.image-picker {
  --background: #352d16;
}

</style>