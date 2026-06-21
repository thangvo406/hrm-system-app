import AlertCircleIcon from './alert-circle.svg';
import EmailIcon from './email.svg';
import EyeOffIcon from './eye-off.svg';
import EyeIcon from './eye.svg';
import FireIcon from './fire.svg';
import GoogleIcon from './google.svg';
import IcArrowLeftGrayIcon from './ic_arrow_left_gray.svg';
import IcCheckIcon from './ic_check.svg';
import IcChevronDownIcon from './ic_chevron_down.svg';
import IcChevronRightIcon from './ic_chevron_right.svg';
import IcClockIcon from './ic_clock.svg';
import IcFilterIcon from './ic_filter.svg';
import IcHomeIcon from './ic_home.svg';
import IcLogoUnappIcon from './ic_logo_unapp.svg';
import IcLogoutIcon from './ic_logout.svg';
import IcMenuIcon from './ic_menu.svg';
import IcRadioSelectedIcon from './ic_radio_selected.svg';
import IcRadioUnselectedIcon from './ic_radio_unselected.svg';
import IcSearchIcon from './ic_search.svg';
import IcStoreIcon from './ic_store.svg';
import KakaoIcon from './kakao.svg';
import LanguageIcon from './language.svg';
import LockIcon from './lock.svg';
import NaverIcon from './naver.svg';
import SendIcon from './send.svg';
import UserIcon from './user.svg';
import XCircleIcon from './x-circle.svg';
import IconNotifyGray from './ic_notify_gray.svg';
import IconNotifyReadAll from './ic_notify_read_all.svg';

const icons = {
  'alert-circle': AlertCircleIcon,
  email: EmailIcon,
  'eye-off': EyeOffIcon,
  eye: EyeIcon,
  fire: FireIcon,
  google: GoogleIcon,
  ic_arrow_left_gray: IcArrowLeftGrayIcon,
  ic_check: IcCheckIcon,
  ic_chevron_down: IcChevronDownIcon,
  ic_chevron_right: IcChevronRightIcon,
  ic_clock: IcClockIcon,
  ic_filter: IcFilterIcon,
  ic_home: IcHomeIcon,
  ic_notify_gray: IconNotifyGray,
  ic_logo_unapp: IcLogoUnappIcon,
  ic_logout: IcLogoutIcon,
  ic_menu: IcMenuIcon,
  ic_radio_selected: IcRadioSelectedIcon,
  ic_radio_unselected: IcRadioUnselectedIcon,
  ic_search: IcSearchIcon,
  ic_store: IcStoreIcon,
  kakao: KakaoIcon,
  ic_notify_read_all: IconNotifyReadAll,
  language: LanguageIcon,
  lock: LockIcon,
  naver: NaverIcon,
  send: SendIcon,
  user: UserIcon,
  'x-circle': XCircleIcon,
} as const;

export type IconName = keyof typeof icons;

export default icons;
