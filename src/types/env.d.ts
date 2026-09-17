declare module 'react-native-config' {
  type NativeConfig = {
    APP_ID?: string;
    APP_IOS_ID?: string;
    APP_NAME?: string;
    BASE_URL?: string;
    DOMAIN_CDN?: string;
    IS_DEV: string;
    URL_GET_ADDRESS?: string;
    GET_ADDRESS_KEY?: string;
    ONE_SIGNAL_ID?: string;
    SOCKET_URL?: string;
  };

  const Config: NativeConfig;
  export default Config;
}

declare module 'react-native-indicators';
