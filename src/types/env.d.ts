declare module 'react-native-config' {
  type NativeConfig = {
    APP_ID?: string;
    APP_NAME?: string;
    BASE_URL?: string;
    IS_DEV: string;
    ONE_SIGNAL_ID?: string;
    DOMAIN_CDN?: string;
  };

  const Config: NativeConfig;
  export default Config;
}

declare module 'react-native-indicators';
