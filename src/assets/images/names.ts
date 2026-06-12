import type { ImageName } from './index';

const imageNames = {
  ic_arrow_left_gray: 'ic_arrow_left_gray',
  ic_info_white: 'ic_info_white',
  ic_logo_banner: 'ic_logo_banner',
  ic_logo_welcome: 'ic_logo_welcome',
  ic_logout_white: 'ic_logout_white',
  ic_outlet_close_white: 'ic_outlet_close_white',
  ic_user_fill: 'ic_user_fill',
  img_discount: 'img_discount',
  img_picture: 'img_picture',
  img_place_map: 'img_place_map',
  img_speaker: 'img_speaker',
} as const satisfies Record<string, ImageName>;

export default imageNames;
