<script setup lang="ts">
import { IonModal, IonTextarea, IonButton, IonAvatar, IonIcon, IonItem, IonListHeader, IonLabel, IonList, IonCardHeader, IonCardSubtitle, IonButtons, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter } from "@ionic/vue";import { ref } from 'vue';
import { chatboxOutline, arrowBack, trash} from 'ionicons/icons';
import { useRoute } from 'vue-router';
import {
  collection,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";

import { useRouter } from 'vue-router';
import TravelSnapImage from "@/components/TravelSnapImage.vue";
import {NewTravelSnap} from "@/models/TravelSnapModel"
import { db } from "@/main";

/* Using the route object, we can get data for the user's current route */
const route = useRoute();
/* Retrieve the id parameter from the current route's query string (/detail/:id) */
const { id } = route.params;
const router = useRouter();

/* State */
const isModalOpen = ref(false);
const newCommentText = ref('');
const isLoadingTravelSnap = ref(true);
const travelSnap = ref<NewTravelSnap| null>(null); 
/*
const travelCollection = collection(db, "travel");
const travelDocRef = doc(travelCollection, `${id}`);

const backHome =() => {
  router.replace('/home')
}

onIonViewDidEnter( async() => {
  await fetchCampingSpot();
})


const fetchCampingSpot = async () => {
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
    console.error("Error fetching the camping spot", error)
  }

} 

const updateComments = async (updatedComments) => {
  try {
    await setDoc(travelDocRef, { comments: updatedComments }, { merge: true });
    travelSnap.value.comments = updatedComments;
  } catch (error) {
    console.error('Error updating comments:', error);
  }
};


const addNewComment = async () => {
  try {
      // Create a new comment object with an increased ID
      const newComment = {
        id: travelSnap.value?.comments? travelSnap.value?.comments.length + 1 : 1,
        text: newCommentText.value
      };

      const updatedComments = travelSnap.value?.comments ? [...travelSnap.value?.comments??[], newComment] : [newComment];
      await updateComment(updatedComments);   
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

    const updatedComments = travelSnap.value?.comments.filter(comment => comment.id !== commentId);
    await updateComments(updatedComments);
  } catch (error) {
    console.error('Error removing comment from Firebase:', error);
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
            <ion-button @click="backHome">
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