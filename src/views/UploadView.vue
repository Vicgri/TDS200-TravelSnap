<script setup lang="ts">
import {
  IonButton,
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
  IonAlert,
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
const alertButtons: { text: string }[] = [{ text: "OK" }];

const newTravelSnap = ref<NewTravelSnap>({
  title: "",
  description: "",
  hashtags: [],
  imageUrls: [],
  comments: [],
  id: "",
  location: { latitude: 0, longitude: 0 },
});
const travelCollection = collection(getFirestore(), "travel");

const addNewHashtag = () => {
  if (newHashtagText.value) {
    newTravelSnap.value.hashtags.push(newHashtagText.value);
    newHashtagText.value = "";
  }
};

const postNewTravelSnap = async () => {
  if (newTravelSnap.value.imageUrls.length === 0) {
    const alert = document.getElementById("upload-alert");
    if (alert) {
      await alert.present();
    }
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
  } catch (error) {
    console.error("Error uploading travel:", error);
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
        <ion-title>Add Travel</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-button
          @click="triggerCamera"
          class="image-picker"
          color="gradient-primary"
        >
          Upload a file or take a photo 📸
        </ion-button>

        <!-- Image previews -->
        <section v-if="newTravelSnap.imageUrls.length">
          <div
            v-for="(imageUrl, index) in newTravelSnap.imageUrls"
            :key="index"
          >
            <img :src="imageUrl" />
            <ion-button
              @click="() => removeImagePreview(index)"
              fill="clear"
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

        <!-- Title input -->
        <ion-item>
          <ion-label position="floating">Title</ion-label>
          <ion-input type="text" v-model="newTravelSnap.title"></ion-input>
        </ion-item>

        <!-- Description textarea -->
        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea
            type="text"
            v-model="newTravelSnap.description"
          ></ion-textarea>
        </ion-item>

        <!-- Location inputs -->
        <ion-item>
          <ion-row>
            <ion-col>
              <ion-label class="label-mild">Latitude</ion-label>
              <ion-input
                type="number"
                v-model="newTravelSnap.location.latitude"
              ></ion-input>
            </ion-col>
            <ion-col>
              <ion-label class="label-mild">Longitude</ion-label>
              <ion-input
                type="number"
                v-model="newTravelSnap.location.longitude"
              ></ion-input>
            </ion-col>
          </ion-row>
        </ion-item>

        <!-- Hashtag input -->
        <ion-item>
          <ion-label position="floating">Hashtags</ion-label>
          <ion-input type="text" v-model="newHashtagText"></ion-input>
          <ion-button
            slot="end"
            style="--background: #352d16; --color: #ffffff"
            @click="addNewHashtag"
          >
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>

        <!-- Display selected hashtags -->
        <ion-item lines="none">
          <ion-chip
            v-for="tag in newTravelSnap.hashtags"
            :key="tag"
            color="tertiary"
            >{{ tag }}</ion-chip
          >
        </ion-item>

        <!-- Upload button -->
        <ion-button class="upload-button" @click="postNewTravelSnap">Upload</ion-button>
        <ion-alert
          id="upload-alert"
          header="Error"
          message="Upload minimum one photo"
          :buttons="alertButtons"
        ></ion-alert>
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

.image-picker {
  height: 20vh;
  margin: 10px;
  border-radius: 8px;
  font-size: medium;
  background: linear-gradient(to bottom, #465b6d, #F3A5A1) !important;
  color: #ffffff !important;
}
.remove-image-preview {
  position: absolute;
  right: 0;
}

.upload-button {
  --background: #465b6d; /* Change the background color to your preferred color */
  --border-radius: 20px; /* Change the border radius to your preferred value */
  color: #ffffff; /* Change the text color to contrast with the background */
  font-weight: bold; /* Optionally make the text bold */
}
</style>
