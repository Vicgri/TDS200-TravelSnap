<script setup lang ="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";
import {arrowBack} from "ionicons/icons";
import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const router = useRouter();
const currentUserData = ref(null);
const db = getFirestore();
const userProfiles = ref([]);
const profileImageSrc = ref(null);


const backToGallery =() => {
  router.push('/tabs/gallery')
}
onIonViewDidEnter(async()=>{
  currentUserData.value = await authService.currentUser();
  await loadProfileImage();
})
const fetchProfileImage = async (userEmail)=>{
  try{
    const results: any[] = [];
    const profilesSnapshot = await getDocs(collection(db, "users"));
    profilesSnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    userProfiles.value = [...results];
    const targetuserProfile = userProfiles.value.find(users => users.email === userEmail);
    return targetuserProfile.profilePicture;

  } catch(error) {
    console.error("Error fetching user profile", error)
    return null;
  }
}

const loadProfileImage = async () => {

  if (currentUserData.value.profilePicture) {
    profileImageSrc.value = currentUserData.value.profilePicture;
  } else {
    profileImageSrc.value = await fetchProfileImage(currentUserData.value.email);
  }
}

const logout = async()=>{
  try {
    await authService.logout();
    localStorage.removeItem("auth_token");
    router.push('/authentication');

  } catch(error) {
    console.error(error)
  }

}

</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Profile</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class ="back-button ion padding">
    <ion-button @click="backToGallery">
      <ion-icon :icon="arrowBack"></ion-icon>
    </ion-button>
  </div>

  <div class ="profile-section ion-padding">
    <div class ="heading ion-padding">
      <h1>Welcome</h1>
    </div>
    <div class="information-section">
      <ion-avatar>
        <img :src="profileImageSrc" alt="Profile Image"/>
      </ion-avatar>
    </div>

    <div class="action-button ion-padding">
      <ion-button size="default" class="logout-button" @click="logout">Log out</ion-button>
    </div>
  </div>
  </ion-content>
</template>

<style scoped>
.heading h1 {
  font-family: "Arial Rounded MT Bold";
  font-size: 43px;
  font-weight: bolder;
  color: #352d16;
}

ion-content {
  --background: #ffffff;
}

.profile-section {
  height: 44vh;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.action-button {
  text-align: center;
  .logout-button {
    --background: #352d16;

  }
}

.back-button ion-button {
  --background: #352d16;
}
</style>