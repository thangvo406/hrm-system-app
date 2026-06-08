import type { ImageName } from './index';

const imageNames = {
  ic_logo_banner: 'ic_logo_banner',
  ic_logo_welcome: 'ic_logo_welcome',
  tom: 'tom',
} as const satisfies Record<string, ImageName>;

export default imageNames;
