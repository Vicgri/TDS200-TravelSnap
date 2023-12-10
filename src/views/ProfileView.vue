<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonItem,
  IonLabel,
  IonToolbar,
  IonPage,
  onIonViewDidEnter,
} from "@ionic/vue";
import { authService } from "../services/firebase.auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
import { User } from "firebase/auth";
import { auth, db } from "@/main";

const router = useRouter();
const currentUserData = ref<User | null>(null);
const userProfiles = ref<{email: string, profilePicture: string}[]>([]);
const profileImageSrc = ref<string | undefined>(undefined);

onIonViewDidEnter(async () => {
  onAuthStateChanged(auth, (user) => {
    currentUserData.value = user; // Update currentUserData with the current user
    loadProfileImage();
  });
});

const fetchProfileImage = async (userEmail: string) => {
  try {
    const results: any[] = [];                                          // Initialize an array to store user profiles
    const profilesSnaps = await getDocs(collection(db, "users")); // Retrieve user profiles from Firestore
    profilesSnaps.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });                     // Extract and push user profile data into the results array
    });
    userProfiles.value = [...results];                                 // Update userProfiles with the fetched user profiles

    const targetUserProfile = userProfiles.value.find(
      (users) => users.email === userEmail   // Find the user profile matching the provided userEmail
    );
    return targetUserProfile.profilePicture;
  } catch (error) {
    console.error("Error fetching user profile", error);
    return null;
  }
};

const loadProfileImage = async () => {
  console.log(currentUserData.value, "userData");
  if (currentUserData.value?.photoURL) {
    profileImageSrc.value = currentUserData.value?.photoURL;  // Set profile image source to the current user's photoURL
  } else if (currentUserData.value) {
    profileImageSrc.value = await fetchProfileImage(
      currentUserData.value.email
    ); // Fetch and set the profile image source using the fetchProfileImage function
  }
};

const logout = async () => {
  try {
    await authService.logout(); // Attempt to log the user out using authService
    localStorage.removeItem("auth_token");  // Remove the authentication token from local storage
    router.push("/authentication");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="profile-section ion-padding">
        <h2 class="welcome-text">Welcome</h2>
        <div class="heading" v-if="currentUserData">
        </div>
        <div class="information-section">
          <ion-avatar>
            <img :src="profileImageSrc" alt="Profile Image" />
          </ion-avatar>
        </div>
    
        <ion-item>
          <div class="email-section ion-padding">
          <ion-label>
            <h3>Email:</h3>
            <p class="p">{{ currentUserData?.email }}</p>
          </ion-label>
          </div>
        </ion-item>
      </div>
      <div class="action-button">
        <ion-button size="default" class="logout-button" @click="logout">Log out</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.welcome-text {
  font-family: "Arial Rounded MT Bold";
  font-size: 43px;
  font-weight: bolder;
  padding-bottom: 25px;
  color: #352d16;
}

ion-content {
  --background: #ffffff;
}

ion-item {
  color:#000000;
  margin-top: 10px;
  border-radius: 20px;
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

.p {
  color: black;
}

.email-section {
  p {
    width: 50px;
  }
}
</style>
