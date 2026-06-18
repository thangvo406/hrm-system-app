import type { AnnouncementImage } from '@type/notifications';
import type { RootState } from '@services/common/store';

const getBanners = (state: RootState): readonly AnnouncementImage[] =>
  state.notifications.banners;

export const NotificationsSelector = {
  getBanners,
};