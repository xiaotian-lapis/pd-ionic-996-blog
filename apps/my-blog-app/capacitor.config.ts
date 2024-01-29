import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.workers996.blogapp',
  appName: 'My 996 blog app',
  webDir: './dist/apps/my-blog-app/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
