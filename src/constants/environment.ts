import Config from 'react-native-config';
import appInfo from '../../app.json';
const { deployments } = appInfo || {};
const deployment = deployments[Config.ENV == 'dev' ? 'staging' : 'production'];
export const Environment = {
  BASE_URL: Config.BASE_URL,
  SOCKET_URL: Config.SOCKET_URL,
  ONE_SIGNAL_ID: Config.ONE_SIGNAL_ID,
  APP_NAME: Config.APP_NAME,
  DOMAIN_CDN: Config.DOMAIN_CDN,
  DEPLOYMENT_KEY_IOS: deployment.ios,
  DEPLOYMENT_KEY_ANDROID: deployment.android,
  CODEPUSH_SERVER: appInfo.server,
};
