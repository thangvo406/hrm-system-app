declare module 'react-native-config' {
  type NativeConfig = {
    API_URL: string;
    DEV_HOST?: string;
  };

  const Config: NativeConfig;
  export default Config;
}

declare module 'react-native-indicators';
