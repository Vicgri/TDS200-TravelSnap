import { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'travelsnap',
  webDir: 'dist',
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
