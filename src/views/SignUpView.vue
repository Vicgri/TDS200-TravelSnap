<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  toastController
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";
import { arrowBack, /*trashBin*/ } from "ionicons/icons";
import { Camera, CameraResultType } from '@capacitor/camera';
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as dbRef,
} from "firebase/storage"

import { v4 as uuidv4 } from "uuid";

const router = useRouter()

const userDetails = ref({
  id: "",
  firstName: "",
  email: "",
  password: "",
  profilePicture: ""
});

// Firestore collection reference for user profiles
const userProfileCollection = collection(getFirestore(), "users");

const login = async () => {
  try {
    const user = await authService.login(userDetails.value.email, userDetails.value.password);  // Attempt user login using authService
    const idToken = await user?.getIdToken(true)                                    // Retrieve and set authentication token
    localStorage.setItem("auth_token", idToken)                                                // Store authentication token in local storage
    console.log("login successful")
    router.replace('/tabs/gallery');
  } catch (error) {
    const e = error as Error;
    console.error("error with login", e.message)
  }
}

// Handles the user signup process asynchronously
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


// Upload a users profile picture.
const postProfilePhoto = async () => {
  if (userDetails.value.profilePicture === "") {
    alert("You must upload a profile picture!");
    return;
  }
  try {
    const generatedUUID = uuidv4();
    const imageName = new Date().getTime() + '.jpg';                            // generate a unique image name
    const storageRef = getStorage();
    const imageRef = dbRef(storageRef, `profilePicture/${imageName}`);      //Define the Firebase Storage reference for the image
    const response = await fetch(userDetails.value.profilePicture);            // Fetch the image from the provided URL
    const imageBlob = await response.blob();                                    // Convert the fetched image to a blob
    const snapshot = await uploadBytes(imageRef, imageBlob);                    // Upload the image to Firebase Storage
    const url = await getDownloadURL(snapshot.ref);                             // Get the download URL of the uploaded image
    userDetails.value.profilePicture = url;                                     // Store the URL in userDetails

    userDetails.value.id = generatedUUID;
    await setDoc(doc(userProfileCollection, generatedUUID), userDetails.value);

    // handle error
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

const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });
  if (photo.webPath) {
    userDetails.value.profilePicture = photo.webPath;   // Set profile picture to the URI obtained from the camera
  }

};

// Button back to log in page
const backToLogin = () => {
  router.replace('/authentication')
}
</script>

<template>
  <ion-content>

    <div class="back-button ion-padding">
      <ion-button @click="backToLogin">
        <ion-icon :icon="arrowBack"></ion-icon>
      </ion-button>
    </div>

    <!-- Sign up Form -->
    <div class="signup-section ion-padding">
      <div class="heading ion-padding">
        <h1>Create an Account</h1>
      </div>

      <div class="signup-form ion-padding">
        <div class="form-input">
          <ion-icon name="name"></ion-icon>
          <ion-item>
            <ion-label position="floating">First Name</ion-label>
            <ion-input type="text" v-model="userDetails.firstName"></ion-input>
          </ion-item>

          <div class="form-input">
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

          <!-- Buttons -->
          <div class="picture-input ion-padding">
            <ion-button @click="triggerCamera" class="image-picker">
              Choose profile picture
            </ion-button>
            <section v-if="userDetails.profilePicture">
              <img :src="userDetails.profilePicture" />
              <!-- <ion-button @click="() => removeImagePreview()" class="remove-image-preview">
                <ion-icon slot="icon-only" :icon="trashBin" color="danger"></ion-icon>
              </ion-button>-->
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
  --border-radius: 30px;

}

.signup-form {
  width: 100%;
}

.action-button {
  text-align: center;

}

ion-button {
  --background: #352d16;
  border-radius: 30px;
  overflow: hidden;

}

.remove-image-preview,
.image-picker {
  --background: #352d16;
}
</style>