jest.mock('@d11/react-native-fast-image', () => {
  const { Image } = require('react-native');
  const FastImage = (props: object) => <Image {...props} />;
  FastImage.resizeMode = {
    center: 'center',
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
  };
  FastImage.priority = {
    high: 'high',
    low: 'low',
    normal: 'normal',
  };
  FastImage.cacheControl = {
    cacheOnly: 'cacheOnly',
    immutable: 'immutable',
    web: 'web',
  };
  FastImage.preload = jest.fn();
  return {
    __esModule: true,
    default: FastImage,
  };
});
