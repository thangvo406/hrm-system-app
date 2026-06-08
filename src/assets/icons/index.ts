import FireIcon from './fire.svg';
import LanguageIcon from './language.svg';
import SendIcon from './send.svg';

const icons = {
  'fire': FireIcon,
  'language': LanguageIcon,
  'send': SendIcon,
} as const;

export type IconName = keyof typeof icons;

export default icons;
