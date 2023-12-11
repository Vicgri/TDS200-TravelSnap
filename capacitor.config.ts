import { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
  appId: 'travelsnap',
  appName: 'travelsnap',
<<<<<<< HEAD
  webDir: "dist",
=======
  webDir: '/',
>>>>>>> 6c088ee2636fb573202fd948115fe67c2ba20ad4
  server: {
    androidScheme: 'https'
  },

  plugins: {

    GoogleMapsPlugin: {

      apiKey: process.env.MAPS_KEY

    }

  }
};

export default config;
