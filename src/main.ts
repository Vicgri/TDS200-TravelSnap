import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader'

const firebaseConfig = {
  apiKey: "AIzaSyD_R-vJrkh4_nTfyDk7Hkky7K0FdsS6g0U",
  authDomain: "travelsnap-1234a.firebaseapp.com",
  projectId: "travelsnap-1234a",
  storageBucket: "travelsnap-1234a.appspot.com",
  messagingSenderId: "2338160955",
  appId: "1:2338160955:web:7d25275c4bd68d6501771e",
  measurementId: "G-6PS61DYRGL"
};

//initialize fra firebase appen
export const firebaseApp = initializeApp(firebaseConfig)
// Get a reference to Firestore
export const db = getFirestore(firebaseApp);

// Get a reference to Firebase Storage
// export const storage = firebase.storage();




const app = createApp(App)
    .use(IonicVue)
    .use(router);



defineCustomElements(window);
router.isReady().then(() => {
  app.mount('#app');
});