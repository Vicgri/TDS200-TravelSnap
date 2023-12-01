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
import { ref } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()

const userDetails = ref ({
  firstName: "",
  email: "",
  password: "",
});

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

const signUp = async () => {
  try {
    await authService.signUp(userDetails.value.email, userDetails.value.password);
    await login()
    router.replace('/tabs/gallery');
  } catch (error) {
    console.log("error with signing up", error.message)
  }
}
</script>