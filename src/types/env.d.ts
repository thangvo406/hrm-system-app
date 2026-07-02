declare module 'react-native-config' {
  type NativeConfig = {
    APP_ID?: string;
    APP_IOS_ID?: string;
    APP_NAME?: string;
    BASE_URL?: string;
    DOMAIN_CDN?: string;
    GOOGLE_ANDROID_CLIENT_ID?: string;
    GOOGLE_IOS_CLIENT_ID?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    IS_DEV: string;
    KAKAO_APP_KEY?: string;
    NAVER_CONSUMER_KEY?: string;
    NAVER_CONSUMER_SECRET?: string;
    NAVER_URL_SCHEME?: string;
    URL_GET_ADDRESS?: string;
    GET_ADDRESS_KEY?: string;
    ONE_SIGNAL_ID?: string;
  };

  const Config: NativeConfig;
  export default Config;
}

declare module 'react-native-indicators';
