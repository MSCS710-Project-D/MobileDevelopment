import { Capacitor } from '@capacitor/core';

const isMobileDevice =  () => {
  if (Capacitor.isNativePlatform()) {
    console.log('Running on a mobile device');
    return true;
  }
  console.log('Not running on a mobile device');
  return false;
};

export { isMobileDevice };
