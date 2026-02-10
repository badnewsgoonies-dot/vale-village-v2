import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.valevillage.app',
  appName: 'Vale Village',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: false,
    backgroundColor: '#000000',
  },
  server: {
    // Use inline resource loading for better performance
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
};

export default config;
