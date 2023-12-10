import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'travelsnap.com',
  appName: 'travelsnap',
  webDir: 'mobile',
  server: {
    androidScheme: 'https'
  }
};

export default config;
