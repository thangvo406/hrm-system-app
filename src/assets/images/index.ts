const images = {
  tom: require('./tom.png') as number,
} as const;

export type ImageName = keyof typeof images;

export default images;
