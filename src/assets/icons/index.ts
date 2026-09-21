import EyeOffIcon from './eye-off.svg';
import EyeIcon from './eye.svg';
import Ic_arrow_left_grayIcon from './ic_arrow_left_gray.svg';
import Ic_arrow_rightIcon from './ic_arrow_right.svg';
import Ic_bellIcon from './ic_bell.svg';
import Ic_calendarIcon from './ic_calendar.svg';
import Ic_cartIcon from './ic_cart.svg';
import Ic_checkIcon from './ic_check.svg';
import Ic_chevron_downIcon from './ic_chevron_down.svg';
import Ic_chevron_rightIcon from './ic_chevron_right.svg';
import Ic_clockIcon from './ic_clock.svg';
import Ic_credit_cardIcon from './ic_credit_card.svg';
import Ic_documentIcon from './ic_document.svg';
import Ic_gridIcon from './ic_grid.svg';
import Ic_homeIcon from './ic_home.svg';
import Ic_infoIcon from './ic_info.svg';
import Ic_locationIcon from './ic_location.svg';
import Ic_lockIcon from './ic_lock.svg';
import Ic_mailIcon from './ic_mail.svg';
import Ic_megaphoneIcon from './ic_megaphone.svg';
import Ic_minus_circleIcon from './ic_minus_circle.svg';
import Ic_notify_read_allIcon from './ic_notify_read_all.svg';
import Ic_qr_memberIcon from './ic_qr_member.svg';
import Ic_qr_scanIcon from './ic_qr_scan.svg';
import Ic_radio_selectedIcon from './ic_radio_selected.svg';
import Ic_radio_unselectedIcon from './ic_radio_unselected.svg';
import Ic_searchIcon from './ic_search.svg';
import Ic_sign_inIcon from './ic_sign_in.svg';
import Ic_sign_outIcon from './ic_sign_out.svg';
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
  ic_chevron_down: Ic_chevron_downIcon,
  ic_chevron_right: Ic_chevron_rightIcon,
  ic_clock: Ic_clockIcon,
  ic_credit_card: Ic_credit_cardIcon,
  ic_document: Ic_documentIcon,
  ic_grid: Ic_gridIcon,
  ic_home: Ic_homeIcon,
  ic_info: Ic_infoIcon,
  ic_location: Ic_locationIcon,
  ic_lock: Ic_lockIcon,
  ic_mail: Ic_mailIcon,
  ic_megaphone: Ic_megaphoneIcon,
  ic_minus_circle: Ic_minus_circleIcon,
  ic_notify_read_all: Ic_notify_read_allIcon,
  ic_qr_member: Ic_qr_memberIcon,
  ic_qr_scan: Ic_qr_scanIcon,
  ic_radio_selected: Ic_radio_selectedIcon,
  ic_radio_unselected: Ic_radio_unselectedIcon,
  ic_search: Ic_searchIcon,
  ic_sign_in: Ic_sign_inIcon,
  ic_sign_out: Ic_sign_outIcon,
  ic_wallet: Ic_walletIcon,
  user: UserIcon,
  'x-circle': XCircleIcon,
} as const;

export type IconName = keyof typeof icons;

export default icons;
