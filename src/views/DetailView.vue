<script setup lang="ts">
import { IonModal, IonTextarea, IonButton, IonAvatar, IonIcon, IonItem, IonListHeader, IonLabel, IonList, IonCardHeader, IonCardSubtitle, IonButtons, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter } from "@ionic/vue";import { ref } from 'vue';
import { chatboxOutline, arrowBack, trash} from 'ionicons/icons';
import { useRoute } from 'vue-router';
import {
  collection,
  getDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { useRouter } from 'vue-router';
import TravelSnapImage from "@/components/TravelSnapImage.vue";
import {NewTravelSnap, TravelComments} from "@/models/TravelSnapModel"
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap} from '@capacitor/google-maps';
import { db, auth } from "@/main";

/* Using the route object, we can get data for the user's current route */
const route = useRoute();
/* Retrieve the id parameter from the current route's query string (/detail/:id) */
const { id } = route.params;
const router = useRouter();

const backToGallery =() => {
  router.replace('tabs/gallery') //skal sende til galleryview.  ?
}

/* State */
const isModalOpen = ref(false);
const newCommentText = ref('');
const isLoadingTravelSnap = ref(true);
const travelSnap = ref<NewTravelSnap| null>(null); 
//const hasUserLiked = ref(false);
const currentUserData = ref(null);
const googleMapsRef = ref(null);


//const travelCollection = collection(db, `travel/${id}`);
const travelDocRef = doc(db, `travel/${id}`);

onIonViewDidEnter( async() => {
  await fetchTravel();
  await readGeoLocation();
  //await checkUserLikeStatus();
  currentUserData.value = auth;
})

const readGeoLocation = async() =>{
try{
      if(!travelSnap.value?.location) {
          const position = await Geolocation.getCurrentPosition();
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const location = {
            latitude,
            longitude,
          };
          await updateDoc(travelDocRef, { location });
          travelSnap.value.location = location;
      }

      console.log (process.env)
       const myMap = await GoogleMap.create({
        id: 'my-google-map', // Unique identifier for this map instance
        element: googleMapsRef.value, // reference to the capacitor-google-map element
        apiKey: process.env.MAPS_KEY, // Your Google Maps API Key
        config: {
          center: {
            // The initial position to be rendered by the map
            lat: travelSnap.value?.location?.latitude,
            lng: travelSnap.value?.location?.longitude,
          },
          zoom: 16, // The initial zoom level to be rendered by the map
        },
      })
      const markerId = await myMap.addMarker({
        coordinate: {
            lat: travelSnap.value?.location?.latitude,
            lng: travelSnap.value?.location?.longitude,
        }
      });  
      
      //await myMap.removeMarker(markerId);

  }

  catch (error) {
      console.error('An error occured trying to get location:', error);
  }
}

const fetchTravel = async () => {
  try{
    let travels: NewTravelSnap | null= null;

    // Get the document
    const docSnap = await getDoc(travelDocRef);
    // Access the document's data
    if (docSnap.exists()) {
      travels = docSnap.data() as NewTravelSnap;
      travelSnap.value = travels;
      isLoadingTravelSnap.value = false;
    } else {
      console.log("No such document!");
    }
  } catch(error) {
    console.error("An error occured fetching travel", error)
  }

} 

const updateComments = async (updatedComments: TravelComments[]) => {
  try {
    await setDoc(travelDocRef, { comments: updatedComments }, { merge: true });
    travelSnap.value.comments = updatedComments;
  } catch (error) {
    console.error('Error updating comments:', error);
  }
};

console.log(currentUserData.value) //value er null og de. skal egentlig være currentUserData ? 
const addNewComment = async () => {
  try {
      // Create a new comment object with an increased ID
      const newComment = {
        id: travelSnap.value?.comments? travelSnap.value?.comments.length + 1 : 1,
        text: newCommentText.value,
        userId: currentUserData.value.name
      };

      const updatedComments = travelSnap.value?.comments ? [...travelSnap.value?.comments??{}, newComment] : [newComment];
      console.log(updatedComments);
      await updateComments(updatedComments);   
      isModalOpen.value = false;
      newCommentText.value = '';
  } catch (error) {
    console.error('Error adding comment to Firebase:', error);
  }
};

const removeComment = async (commentId: number) => {
  try {  
    const targetComment = travelSnap.value?.comments.find(comment => comment.id === commentId);
    
    if (!targetComment) {
      throw new Error('Comment not found.');
    }

    const updatedComments = travelSnap.value?.comments.filter(comment => comment.id !== commentId)
    
    if (updatedComments) {
      await updateComments(updatedComments);
    }
  } catch (error) {
    console.error('Error removing comment from Firebase:', error);
  }
};

/*
// Function to toggle the user's like status
    const toggleLikeStatus = async () => {
    try {
      if (currentUserData.value) {
        console.log(currentUserData.value.email)
        const docSnapshot = await getDoc(travelSnapDocRef);
        const docData = docSnapshot.data();
        // Check if the user has already liked the travel post
        if (docData.userWhoLiked && docData.userWhoLiked.includes(currentUserData.value.email)) {
          // User has liked, so remove their like
          const updatedLikes = docData.userWhoLiked.filter((userId) => userId !== currentUserData.value.email);
          console.log(updatedLikes)
          await setDoc(travelSnapDocRef, { userWhoLiked: updatedLikes }, { merge: true });   
          travelSnap.value.userWhoLiked = updatedLikes;
        } else {
          // User has not liked, so add their like
          const updatedLikes = [...(docData.userWhoLiked || []), currentUserData.value.email];
                    console.log(updatedLikes)
          await setDoc(travelSnapDocRef, { userWhoLiked: updatedLikes }, { merge: true });   
          travelSnap.value.userWhoLiked = updatedLikes;
        }

        hasUserLiked.value = !hasUserLiked.value;

      }
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
    
  }; 
  
*/
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Details</ion-title>   
        <ion-buttons slot="start">
            <ion-button @click="backToGallery">
                <ion-icon :icon="arrowBack"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true" id="commentButton">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title v-if="travelSnap">{{travelSnap.title}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="travelSnap && !isLoadingTravelSnap">

      <!-- Hero image section -->
      <div v-for="(image, index) in travelSnap.imageUrls" :key="index">
        <travel-snap-image :image-url="image" />
      </div>

      <!-- Hashtag section -->
      <ion-chip v-for="hashtag in travelSnap.hashtags" :key="hashtag" color="tertiary">#{{hashtag}}</ion-chip>

      <!-- Camping spot info section -->
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Description</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{travelSnap.description}}  
          <div v-if="travelSnap.location">
            Geolocation: <ion-chip>Latitude: {{travelSnap.location.latitude}}, Longitude:  {{travelSnap.location.longitude}}</ion-chip>
          </div>
          <div>
            <capacitor-google-map ref="googleMapsRef" style="display: inline-block; width: 60%; height: 400px;"></capacitor-google-map>
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
          <ion-item v-for="comment in travelSnap.comments" :key="comment.id" lines="none">
              <ion-avatar slot="start">
                  <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
              </ion-avatar>
              <ion-label class="ion-text-wrap comment-container">
                  <div class="comment-username">
                      <b>{{comment.userId}} </b>
                  </div>
                  <div class="comment-text-and-icon">
                      <p class="comment-text">{{comment.text}}</p>
                      <ion-icon :icon="trash" @click="removeComment(comment.id)"></ion-icon>
                  </div>
              </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>

      <ion-modal 
        :is-open="isModalOpen" 
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        @did-dismiss="isModalOpen = false">
          <ion-content>
            <ion-item lines="none">
              <ion-label position="floating">New comment</ion-label>
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
    flex: 1; /* This allows the text to take up the available space, pushing the icon to the far right */
}
.spot-image {
  width: 100%;       /* Sets the width to 100% of its container */
  object-fit: cover; /* Ensure the images resize to cover the entire area without stretching */
  display: block;    /* Removes any bottom spacing that images might have by default */
}
ion-button::part(native) {
  --background: #352D16;
  --color: white; 
}
#commentButton::part(native) {
  --background: white;
  --color: #352D16;
}
</style>