import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hexpress',
  appName: 'hexpressmobile',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
