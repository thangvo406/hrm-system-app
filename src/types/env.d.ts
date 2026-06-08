declare module 'react-native-config' {
  interface NativeConfig {
    API_URL: string;
    DEV_HOST?: string;
  }

  const Config: NativeConfig;
  export default Config;
}
