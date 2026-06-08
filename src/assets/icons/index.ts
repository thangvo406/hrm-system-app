import AlertCircleIcon from './alert-circle.svg';
import EmailIcon from './email.svg';
import EyeOffIcon from './eye-off.svg';
import EyeIcon from './eye.svg';
import FireIcon from './fire.svg';
import GoogleIcon from './google.svg';
import KakaoIcon from './kakao.svg';
import LanguageIcon from './language.svg';
import LockIcon from './lock.svg';
import NaverIcon from './naver.svg';
import SendIcon from './send.svg';
import UserIcon from './user.svg';
import XCircleIcon from './x-circle.svg';

const icons = {
  'alert-circle': AlertCircleIcon,
  email: EmailIcon,
  'eye-off': EyeOffIcon,
  eye: EyeIcon,
  fire: FireIcon,
  google: GoogleIcon,
  kakao: KakaoIcon,
  language: LanguageIcon,
  lock: LockIcon,
  naver: NaverIcon,
  send: SendIcon,
  user: UserIcon,
  'x-circle': XCircleIcon,
} as const;

export type IconName = keyof typeof icons;

export default icons;
