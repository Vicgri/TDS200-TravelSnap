<script setup lang ="ts">
import {
  IonButton,
  IonContent ,
  IonInput,
  IonItem,
} from '@ionic/vue';
import { authService } from "../services/firebase.auth"
import { ref } from "vue"
import { useRouter } from "vue-router";

const router = useRouter();


</script>

<style scoped>
.heading h1 {
  font-family: "Arial Rounded MT Bold";
  font-size: 43px;
  font-weight: bolder;
  color: #f8f8e5;
}


ion-content {
  background: #ffffff;
}
</style>