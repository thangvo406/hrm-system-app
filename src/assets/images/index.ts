const images = {
  bg_login: require('./bg_login.png') as number,
  ic_arrow_left_gray: require('./ic_arrow_left_gray.png') as number,
  ic_camera_gray: require('./ic_camera_gray.png') as number,
  ic_close_gray: require('./ic_close_gray.png') as number,
  ic_device_force_update: require('./ic_device_force_update.png') as number,
  ic_gallery_gray: require('./ic_gallery_gray.png') as number,
  ic_info_white: require('./ic_info_white.png') as number,
  ic_network_error: require('./ic_network_error.png') as number,
  ic_outlet_close_white: require('./ic_outlet_close_white.png') as number,
} as const;

export type ImageName = keyof typeof images;

export default images;
