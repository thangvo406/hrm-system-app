import type { ImageName } from './index';

const imageNames = {
  bg_login: 'bg_login',
  ic_arrow_left_gray: 'ic_arrow_left_gray',
  ic_camera_gray: 'ic_camera_gray',
  ic_close_gray: 'ic_close_gray',
  ic_device_force_update: 'ic_device_force_update',
  ic_gallery_gray: 'ic_gallery_gray',
  ic_info_white: 'ic_info_white',
  ic_network_error: 'ic_network_error',
  ic_outlet_close_white: 'ic_outlet_close_white',
} as const satisfies Record<string, ImageName>;

export default imageNames;
