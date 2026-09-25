import type { ImageName } from './index';

const imageNames = {
  bg_home_header: 'bg_home_header',
  bg_login: 'bg_login',
  bg_profile: 'bg_profile',
  ic_arrow_left_gray: 'ic_arrow_left_gray',
  ic_attendance_histories_empty: 'ic_attendance_histories_empty',
  ic_camera_gray: 'ic_camera_gray',
  ic_close_gray: 'ic_close_gray',
  ic_device_force_update: 'ic_device_force_update',
  ic_gallery_gray: 'ic_gallery_gray',
  ic_info_white: 'ic_info_white',
  ic_logo_login: 'ic_logo_login',
  ic_network_error: 'ic_network_error',
  ic_outlet_close_white: 'ic_outlet_close_white',
  ic_request_empty: 'ic_request_empty',
} as const satisfies Record<string, ImageName>;

export default imageNames;
