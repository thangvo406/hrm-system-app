declare module 'react-native-config' {
  type NativeConfig = {
    APP_ID?: string;
    APP_IOS_ID?: string;
    APP_NAME?: string;
    BASE_URL?: string;
    DOMAIN_CDN?: string;
    GOOGLE_IOS_CLIENT_ID?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    IS_DEV: string;
    ONE_SIGNAL_ID?: string;
  };

  const Config: NativeConfig;
  export default Config;
}

declare module 'react-native-indicators';
