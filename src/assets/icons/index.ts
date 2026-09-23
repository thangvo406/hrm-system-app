import EyeOffIcon from './eye-off.svg';
import EyeIcon from './eye.svg';
import Ic_arrow_left_grayIcon from './ic_arrow_left_gray.svg';
import Ic_arrow_rightIcon from './ic_arrow_right.svg';
import Ic_bellIcon from './ic_bell.svg';
import Ic_calendarIcon from './ic_calendar.svg';
import Ic_cartIcon from './ic_cart.svg';
import Ic_checkIcon from './ic_check.svg';
import Ic_check_circleIcon from './ic_check_circle.svg';
import Ic_chevron_downIcon from './ic_chevron_down.svg';
import Ic_chevron_rightIcon from './ic_chevron_right.svg';
import Ic_clockIcon from './ic_clock.svg';
import Ic_closeIcon from './ic_close.svg';
import Ic_credit_cardIcon from './ic_credit_card.svg';
import Ic_documentIcon from './ic_document.svg';
import Ic_dotsIcon from './ic_dots.svg';
import Ic_downloadIcon from './ic_download.svg';
import Ic_filterIcon from './ic_filter.svg';
import Ic_funnelIcon from './ic_funnel.svg';
import Ic_gridIcon from './ic_grid.svg';
import Ic_homeIcon from './ic_home.svg';
import Ic_infoIcon from './ic_info.svg';
import Ic_locationIcon from './ic_location.svg';
import Ic_lockIcon from './ic_lock.svg';
import Ic_mailIcon from './ic_mail.svg';
import Ic_megaphoneIcon from './ic_megaphone.svg';
import Ic_minus_circleIcon from './ic_minus_circle.svg';
import Ic_notify_read_allIcon from './ic_notify_read_all.svg';
import Ic_paperclipIcon from './ic_paperclip.svg';
import Ic_plus_circleIcon from './ic_plus_circle.svg';
import Ic_qr_memberIcon from './ic_qr_member.svg';
import Ic_qr_scanIcon from './ic_qr_scan.svg';
import Ic_radio_selectedIcon from './ic_radio_selected.svg';
import Ic_radio_unselectedIcon from './ic_radio_unselected.svg';
import Ic_resetIcon from './ic_reset.svg';
import Ic_searchIcon from './ic_search.svg';
import Ic_sendIcon from './ic_send.svg';
import Ic_sign_inIcon from './ic_sign_in.svg';
import Ic_sign_outIcon from './ic_sign_out.svg';
import Ic_stackIcon from './ic_stack.svg';
import Ic_starIcon from './ic_star.svg';
import Ic_sunIcon from './ic_sun.svg';
import Ic_sunriseIcon from './ic_sunrise.svg';
import Ic_sunsetIcon from './ic_sunset.svg';
import Ic_trashIcon from './ic_trash.svg';
import Ic_walletIcon from './ic_wallet.svg';
import UserIcon from './user.svg';
import XCircleIcon from './x-circle.svg';

const icons = {
  'eye-off': EyeOffIcon,
  eye: EyeIcon,
  ic_arrow_left_gray: Ic_arrow_left_grayIcon,
  ic_arrow_right: Ic_arrow_rightIcon,
  ic_bell: Ic_bellIcon,
  ic_calendar: Ic_calendarIcon,
  ic_cart: Ic_cartIcon,
  ic_check: Ic_checkIcon,
  ic_check_circle: Ic_check_circleIcon,
  ic_chevron_down: Ic_chevron_downIcon,
  ic_chevron_right: Ic_chevron_rightIcon,
  ic_clock: Ic_clockIcon,
  ic_close: Ic_closeIcon,
  ic_credit_card: Ic_credit_cardIcon,
  ic_document: Ic_documentIcon,
  ic_dots: Ic_dotsIcon,
  ic_download: Ic_downloadIcon,
  ic_filter: Ic_filterIcon,
  ic_funnel: Ic_funnelIcon,
  ic_grid: Ic_gridIcon,
  ic_home: Ic_homeIcon,
  ic_info: Ic_infoIcon,
  ic_location: Ic_locationIcon,
  ic_lock: Ic_lockIcon,
  ic_mail: Ic_mailIcon,
  ic_megaphone: Ic_megaphoneIcon,
  ic_minus_circle: Ic_minus_circleIcon,
  ic_notify_read_all: Ic_notify_read_allIcon,
  ic_paperclip: Ic_paperclipIcon,
  ic_plus_circle: Ic_plus_circleIcon,
  ic_qr_member: Ic_qr_memberIcon,
  ic_qr_scan: Ic_qr_scanIcon,
  ic_radio_selected: Ic_radio_selectedIcon,
  ic_radio_unselected: Ic_radio_unselectedIcon,
  ic_reset: Ic_resetIcon,
  ic_search: Ic_searchIcon,
  ic_send: Ic_sendIcon,
  ic_sign_in: Ic_sign_inIcon,
  ic_sign_out: Ic_sign_outIcon,
  ic_stack: Ic_stackIcon,
  ic_star: Ic_starIcon,
  ic_sun: Ic_sunIcon,
  ic_sunrise: Ic_sunriseIcon,
  ic_sunset: Ic_sunsetIcon,
  ic_trash: Ic_trashIcon,
  ic_wallet: Ic_walletIcon,
  user: UserIcon,
  'x-circle': XCircleIcon,
} as const;

export type IconName = keyof typeof icons;

export default icons;
