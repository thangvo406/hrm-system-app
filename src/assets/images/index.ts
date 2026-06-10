const images = {
  ic_info_white: require('./ic_info_white.png') as number,
  ic_logo_banner: require('./ic_logo_banner.png') as number,
  ic_logo_welcome: require('./ic_logo_welcome.png') as number,
  ic_outlet_close_white: require('./ic_outlet_close_white.png') as number,
} as const;

export type ImageName = keyof typeof images;

export default images;
