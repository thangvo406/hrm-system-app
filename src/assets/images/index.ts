const images = {
  ic_arrow_left_gray: require('./ic_arrow_left_gray.png') as number,
  ic_info_white: require('./ic_info_white.png') as number,
  ic_logo_banner: require('./ic_logo_banner.png') as number,
  ic_logo_welcome: require('./ic_logo_welcome.png') as number,
  ic_logout_white: require('./ic_logout_white.png') as number,
  ic_outlet_close_white: require('./ic_outlet_close_white.png') as number,
  ic_user_fill: require('./ic_user_fill.png') as number,
  img_discount: require('./img_discount.png') as number,
  img_picture: require('./img_picture.png') as number,
  img_place_map: require('./img_place_map.png') as number,
  img_speaker: require('./img_speaker.png') as number,
} as const;

export type ImageName = keyof typeof images;

export default images;
