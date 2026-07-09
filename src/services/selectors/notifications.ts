import type { TAnnouncementImage } from '@type/notifications';
import type { RootState } from '@services/common/store';

const getBanners = (state: RootState): readonly TAnnouncementImage[] =>
  state.notifications.banners;

export const NotificationsSelector = {
  getBanners,
};
