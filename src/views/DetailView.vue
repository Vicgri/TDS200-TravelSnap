<script setup lang="ts">
import {
  IonModal,
  IonTextarea,
  IonButton,
  IonAvatar,
  IonIcon,
  IonItem,
  IonListHeader,
  IonLabel,
  IonList,
  IonCardHeader,
  IonCardSubtitle,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
} from "@ionic/vue";
import { ref } from "vue";
import { chatboxOutline, trash } from "ionicons/icons";
import { useRoute } from "vue-router";
import { collection, getDoc, setDoc, updateDoc, doc } from "firebase/firestore";

import { useRouter } from "vue-router";
import TravelSnapImage from "@/components/TravelSnapImage.vue";
import { NewTravelSnap, TravelComments } from "@/models/TravelSnapModel";
import { Geolocation } from "@capacitor/geolocation";
import { GoogleMap } from "@capacitor/google-maps";
import { db, auth } from "@/main";

// Routing
const route = useRoute();
const { id } = route.params;
const router = useRouter();

// States
const isModalOpen = ref(false);
const newCommentText = ref("");
const isLoadingTravelSnap = ref(true);
const travelSnap = ref<NewTravelSnap | null>(null);
const currentUserData = ref(null);
const googleMapsRef = ref(null);
const travelDocRef = doc(db, `travel/${id}`);

// Lifecycle hook, executes when view is entered.
onIonViewDidEnter(async () => {
  await fetchTravel();
  await readGeoLocation();
  currentUserData.value = auth;
});

//Geolocation
const readGeoLocation = async () => {
  try {
    if (!travelSnap.value?.location) {
      // Gets the current device's geolocation
      const position = await Geolocation.getCurrentPosition();
      // Creates a location object with latitude and longitude
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const location = {
        latitude,
        longitude,
      };
      // Updates the Firestore document with the new location
      await updateDoc(travelDocRef, { location });
      // Updates the local travelSnap with the new location
      travelSnap.value.location = location;
    }

    /* Google Maps
    - Creates a Google Map using Capacitor Google Maps plugin */
    const myMap = await GoogleMap.create({
      id: "my-google-map",
      element: googleMapsRef.value,
      apiKey: process.env.MAPS_KEY,
      config: {
        center: {
          lat: travelSnap.value?.location?.latitude,
          lng: travelSnap.value?.location?.longitude,
        },
        zoom: 16,
      },
    });

    // Adds a marker to the map at the travel location
    const markerId = await myMap.addMarker({
      coordinate: {
        lat: travelSnap.value?.location?.latitude,
        lng: travelSnap.value?.location?.longitude,
      },
    });
  } catch (error) {
    console.error("An error occured trying to get location:", error);
  }
};

//Gets document from firestore and accesses the document´s data.
const fetchTravel = async () => {
  try {
    let travels: NewTravelSnap | null = null;

    const docSnap = await getDoc(travelDocRef);

    if (docSnap.exists()) {
      travels = docSnap.data() as NewTravelSnap;
      travelSnap.value = travels;
      isLoadingTravelSnap.value = false;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("An error occured fetching travel", error);
  }
};

// Updates the Firestore document with the updated comments
const updateComments = async (updatedComments: TravelComments[]) => {
  try {
    await setDoc(travelDocRef, { comments: updatedComments }, { merge: true });
    travelSnap.value.comments = updatedComments;
  } catch (error) {
    console.error("Error updating comments:", error);
  }
};
// Add comments
console.log(currentUserData.value);
const addNewComment = async () => {
  try {
    // Creates a new comment object with an increased ID
    const newComment = {
      id: travelSnap.value?.comments
        ? travelSnap.value?.comments.length + 1
        : 1,
      text: newCommentText.value,
      userId: currentUserData.value.name,
    };

    // Creates an array of updated comments by adding the new comment
    const updatedComments = travelSnap.value?.comments
      ? [...(travelSnap.value?.comments ?? {}), newComment]
      : [newComment];
    console.log(updatedComments);
    // Update comments in Firestore using the updateComments function
    await updateComments(updatedComments);
    isModalOpen.value = false;
    newCommentText.value = "";
  } catch (error) {
    console.error("Error adding comment to Firebase:", error);
  }
};

// Delete comments
const removeComment = async (commentId: number) => {
  try {
    // Finds the target comment in the existing comments array
    const targetComment = travelSnap.value?.comments.find(
      (comment) => comment.id === commentId
    );
    if (!targetComment) {
      throw new Error("Comment not found.");
    }
    // Creates an array of updated comments by excluding the target comment
    const updatedComments = travelSnap.value?.comments.filter(
      (comment) => comment.id !== commentId
    );
    // If there are updated comments, calls the updateComments function
    if (updatedComments) {
      await updateComments(updatedComments);
    }
  } catch (error) {
    console.error("Error removing comment from Firebase:", error);
  }
};
</script>

<template>
  <ion-page>
    <!-- Header with back button, title, and comment button -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/gallery"></ion-back-button>
        </ion-buttons>
        <ion-title>{{
          travelSnap ? travelSnap.title : "Loading..."
        }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true" id="commentButton">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Image gallery and travelsnap details -->
    <ion-content :fullscreen="true" v-if="travelSnap && !isLoadingTravelSnap">
      <ion-card>
        <div v-for="(image, index) in travelSnap.imageUrls" :key="index">
          <travel-snap-image :image-url="image" />
        </div>
        <ion-card-header>
          <ion-card-subtitle>Description</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ travelSnap ? travelSnap.description : "Loading..." }}
          <ion-chip v-for="hashtag in travelSnap.hashtags" :key="hashtag"
            >{{ hashtag }}</ion-chip
          >
          <div v-if="travelSnap && travelSnap.location">
            Geolocation:
            <ion-chip
              >Latitude: {{ travelSnap.location.latitude }}, Longitude:
              {{ travelSnap.location.longitude }}</ion-chip
            >
          </div>

          <!-- Capacitor Google Map component -->
          <div>
            <capacitor-google-map
              ref="googleMapsRef"
              style="display: inline-block; width: 100%; height: 300px"
            ></capacitor-google-map>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Comment section -->
      <ion-card>
        <ion-list>
          <ion-list-header>
            <ion-label>
              Comments
              <ion-icon :icon="chatboxOutline"></ion-icon>
            </ion-label>
          </ion-list-header>
          <!-- Displaying comments -->
          <ion-item
            v-for="comment in travelSnap ? travelSnap.comments : []"
            :key="comment.id"
            lines="none"
          >
            <ion-avatar slot="start">
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=="
              />
            </ion-avatar>
            <ion-label class="ion-text-wrap comment-container">
              <div class="comment-username">
                <b>{{ comment.userId }}</b>
              </div>
              <div class="comment-text-and-icon">
                <p class="comment-text">{{ comment.text }}</p>
                <ion-icon
                  :icon="trash"
                  @click="removeComment(comment.id)"
                ></ion-icon>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>

      <!-- Comment input modal -->
      <ion-modal
        :is-open="isModalOpen"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        @did-dismiss="isModalOpen = false"
      >
        <ion-content>
          <ion-item lines="none">
            <ion-label class="comment-label" position="floating"
              >New comment</ion-label
            >
            <ion-textarea v-model="newCommentText"></ion-textarea>
            <ion-button @click="addNewComment">Add comment</ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.comment-container {
  display: flex;
  flex-direction: column;
}

.comment-text-and-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.comment-text {
  flex: 1;
}
ion-chip {
  --ion-background-color: #e0e0e0;
  --ion-color: #000;
  margin-right: 8px;
  font-size: 0.9rem;
}

ion-button::part(native) {
  --background: #352d16;
  --color: #ffffff;
}
#commentButton::part(native) {
  --background: #ffffff;
  --color: #352d16;
}

.comment-label {
  margin-bottom: 20px;
}
ion-textarea {
  --background: rgba(128, 128, 128, 0.1);
  border-radius: 10px;
  margin-top: 10px;
}
</style>
