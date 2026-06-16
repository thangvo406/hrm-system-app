import Config from 'react-native-config';
export const Environment = {
  IS_DEV: Config.IS_DEV == 'true',
  BASE_URL: Config.BASE_URL,
  ONE_SIGNAL_ID: Config.ONE_SIGNAL_ID,
  APP_NAME: Config.APP_NAME,
  DOMAIN_CDN: Config.DOMAIN_CDN,
};
