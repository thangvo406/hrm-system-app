const images = {
  ic_logo_banner: require('./ic_logo_banner.png') as number,
  ic_logo_welcome: require('./ic_logo_welcome.png') as number,
  tom: require('./tom.png') as number,
} as const;

export type ImageName = keyof typeof images;

export default images;
