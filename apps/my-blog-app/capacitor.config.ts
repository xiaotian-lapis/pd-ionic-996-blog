import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.996workers.blogapp',
  appName: 'My 996 blog app',
  webDir: '../../dist/apps/my-blog-app',
  server: {
    androidScheme: 'https'
  }
};

export default config;
