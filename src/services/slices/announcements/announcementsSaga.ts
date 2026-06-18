import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AnnouncementItem,
  GetAnnouncementsPayload,
} from '@type/announcements';

import { delay, takeLatest } from 'redux-saga/effects';
import { getAnnouncementsRequest } from './announcementsSlice';

const MOCK_DATA: AnnouncementItem[] = [
  {
    date: '06-04-16',
    icon: '🎉',
    id: 'a1',
    kind: 'event',
    title: '[EVENT] 다시 돌아온 캠퍼스의 봄, 생협 첫 결제하고 포인트 받자!',
  },
  {
    date: '06-04-15',
    icon: '🍱',
    id: 'a2',
    kind: 'notice',
    title: '[학식] 이번 주 ‘똑식 데이’ 메뉴 확인하기 (Feat. 생협 조합원 할인)',
  },
  {
    date: '06-04-07',
    icon: '📚',
    id: 'a3',
    kind: 'notice',
    title: '[공지] 전공 서적 공동구매 안내: 무거운 가방은 덜고, 지갑은 채우자!',
  },
  {
    date: '06-04-03',
    icon: '🎁',
    id: 'a4',
    kind: 'event',
    title: '[이벤트] 중간고사 응원 간식팩 신청순 100명 쿠폰 증정',
  },
  {
    date: '06-03-31',
    icon: '📌',
    id: 'a5',
    kind: 'notice',
    title: '[안내] 잠자는 포인트 깨우기! 생협 포인트 사용 가이드 (조합원 필독)',
  },
  {
    date: '06-03-27',
    icon: '☕',
    id: 'a6',
    kind: 'event',
    title: '[쿠폰] 나른한 오후, 학생식당 커피 1+1 기프티콘 도착!',
  },
  {
    date: '06-03-24',
    icon: '🎨',
    id: 'a7',
    kind: 'event',
    title: '[신규] 우리 대학 굿즈 디자인 공모전 — 내 아이디어가 상품으로?',
  },
  {
    date: '06-03-20',
    icon: '🌱',
    id: 'a8',
    kind: 'notice',
    title: '[Eco] 일회용품 줄이기 캠페인: 텀블러 지참 시 전 메뉴 추가 할인',
  },
  {
    date: '06-03-17',
    icon: '📣',
    id: 'a9',
    kind: 'notice',
    title: '[모집] 2026학년도 생협 학생위원회 ‘서포터즈’ 1기 대모집',
  },
  {
    date: '06-03-13',
    icon: '🛒',
    id: 'a10',
    kind: 'event',
    title: '[특가] 생협 편의점 봄맞이 2+1 행사 품목 리스트 공개',
  },
  {
    date: '06-03-06',
    icon: '🩺',
    id: 'a11',
    kind: 'notice',
    title: '[서비스] 노트북 무상 점검 Day! 생협 IT 지원 센터 이용 안내',
  },
  {
    date: '06-03-03',
    icon: '🗣️',
    id: 'a12',
    kind: 'event',
    title: '[설문] “우리가 원하는 학식 메뉴는?” 설문 참여하고 커피 받자',
  },
];

const MOCK_DELAY_MS = 500;

function* getAnnouncementsWorker(
  action: PayloadAction<GetAnnouncementsPayload>,
): Generator<unknown, void, void> {
  try {
    // TODO: replace with real API call once /announcements endpoint is live:
    // const items: AnnouncementItem[] = yield call(getAnnouncements);
    yield delay(MOCK_DELAY_MS);
    action.payload.onSuccess?.(MOCK_DATA);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    action.payload.onFailure?.(message);
  }
}

export function* announcementsSaga() {
  yield takeLatest(getAnnouncementsRequest.type, getAnnouncementsWorker);
}
