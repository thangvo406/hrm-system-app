import type { ImageName } from './index';

const imageNames = {
  ic_info_white: 'ic_info_white',
  ic_logo_banner: 'ic_logo_banner',
  ic_logo_welcome: 'ic_logo_welcome',
  ic_outlet_close_white: 'ic_outlet_close_white',
  tom: 'tom',
} as const satisfies Record<string, ImageName>;

export default imageNames;
