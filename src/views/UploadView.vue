<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  toastController,
} from "@ionic/vue";
import { add, trashOutline } from "ionicons/icons";
import { ref } from "vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as dbRef,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "vue-router";
import { NewTravelSnap } from "../models/TravelSnapModel";

const router = useRouter();
// Keeps track of the input field for new hashtags
const newHashtagText = ref("");

// Keeps track of all data input from the user towards adding a new camp spot

const newTravelSnap = ref<NewTravelSnap>({
  title: "",
  description: "",
  hashtags: [],
  imageUrls: [], // Array to store multiple image URLs
  comments: [],
  id: "",
  location: { latitude: 0, longitude: 0 },
});
const travelCollection = collection(getFirestore(), "travel");
// Add whatever is in the hashtag input field to the camp spot's array of hashtags
const addNewHashtag = () => {
  // Avoid adding empty hashtags
  if (newHashtagText.value) {
    newTravelSnap.value.hashtags.push(newHashtagText.value); // LES: Det er ikke farlig hvis du får røde squiggly lines her, det skal vi senere fikse med TypeScript
    newHashtagText.value = "";
  }

  // TODO Logic to avoid duplicate hashtags
};
// Handle data POSTing
const postNewTravelSnap = async () => {
  // TODO Logic to post the camp spot to the backend/Directus
  if (newTravelSnap.value.imageUrls.length === 0) {
    alert("Upload minimum one photo");
    return;
  }

  try {
    const generatedUUID = uuidv4();
    const newImageUrls = [];
    for (const imageUrl of newTravelSnap.value.imageUrls) {
      const imageName = new Date().getTime() + ".jpg"; // generate a unique image name
      const storageRef = getStorage();
      const imageRef = dbRef(storageRef, `images/${imageName}`);
      const response = await fetch(imageUrl);
      console.log(imageUrl);
      console.log(response);
      const imageBlob = await response.blob();
      const snapshot = await uploadBytes(imageRef, imageBlob);
      const url = await getDownloadURL(snapshot.ref);
      newImageUrls.push(url); // Store the URL
    }
    newTravelSnap.value.imageUrls = newImageUrls;
    newTravelSnap.value.id = generatedUUID;
    await setDoc(doc(travelCollection, generatedUUID), newTravelSnap.value);
    const successToast = await toastController.create({
      message: "Travel uploaded",
      duration: 1500,
      position: "bottom",
      color: "success",
    });

    await successToast.present();
    router.replace("/home");
  } catch (error) {
    const errorToast = await toastController.create({
      message: "Noe gikk galt ved opplasting av teltplass!",
      duration: 2500,
      position: "bottom",
      color: "danger",
    });

    await errorToast.present();
    console.error(error);
  }
};
// Open the device's camera and/or file picker UI
const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });
  if (photo.webPath) {
    newTravelSnap.value.imageUrls.push(photo.webPath);
  }
};

// Handle (preview) image removal
const removeImagePreview = (index: number) => {
  // Check if the index is within bounds
  if (index >= 0 && index < newTravelSnap.value.imageUrls.length) {
    // Remove the image URL at the specified index
    newTravelSnap.value.imageUrls.splice(index, 1);
  }
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Add travel</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <!-- Logic for file picking / using camera will be added later -->
        <ion-button @click="triggerCamera" class="image-picker" color="light">
          Choose a file or take a photo 📸
        </ion-button>

        <section v-if="newTravelSnap.imageUrls.length">
          <div
            v-for="(imageUrl, index) in newTravelSnap.imageUrls"
            :key="index"
          >
            <!--sto imageUrls-->
            <img :src="imageUrl" />
            <ion-button
              @click="() => removeImagePreview(index)"
              fill="default"
              class="remove-image-preview"
            >
              <ion-icon
                slot="icon-only"
                :icon="trashOutline"
                color="danger"
              ></ion-icon>
            </ion-button>
          </div>
        </section>

        <ion-item>
          <ion-label class="label-mild" position="floating">Title</ion-label>
          <ion-input type="text" v-model="newTravelSnap.title"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating"
            >Description</ion-label
          >
          <ion-textarea
            type="text"
            v-model="newTravelSnap.description"
          ></ion-textarea>
        </ion-item>

        <p class="label-mild" position="floating">Location</p>

        <ion-item>
          <ion-input
            label="Latitude"
            type="number"
            v-model="newTravelSnap.location.latitude"
          ></ion-input>
          <ion-input
            label="Longitude"
            type="number"
            v-model="newTravelSnap.location.longitude"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Hashtags</ion-label>
          <ion-input type="text" v-model="newHashtagText"></ion-input>

          <ion-button
            slot="end"
            color="dark"
            size="default"
            @click="addNewHashtag"
          >
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item lines="none">
          <ion-chip
            color="primary"
            v-for="tag in newTravelSnap.hashtags"
            :key="tag"
            >{{ tag }}</ion-chip
          >
        </ion-item>

        <ion-button
          @click="postNewTravelSnap"
          class="button-add"
          fill="solid"
          color="dark"
          size="default"
        >
          Upload
        </ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --ion-background-color: #f4f4f4;
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}

.label-mild {
  --color: #8a8a8a !important;
}

.image-picker {
  height: 20vh;
  margin: 10px;
  border: 2px #007b88 dashed;
  border-radius: 8px;
  font-size: medium;
}

.remove-image-preview {
  position: absolute;
  right: 0;
}

.button-add {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
ion-back-button::part(native) {
  --background: #352d16;
  --color: white; /*virker ikke*/
}
</style>
