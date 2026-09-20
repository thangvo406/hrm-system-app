import { Dimensions } from 'react-native';
import { ScaleSize } from '@kits/core';

/**
 * Chiều cao dải navy mà thẻ ca làm việc đè lên.
 *
 * Header được ghim cố định, nên dải navy này KHÔNG thuộc header mà là phần tử
 * đầu tiên bên trong vùng cuộn (`HeaderOverlap`), còn thẻ ca làm việc lấy
 * `marginTop` âm để trùm lên nó. Nhờ vậy dải navy trượt lên cùng thẻ khi cuộn,
 * và cả hai bị cắt gọn ở mép dưới header thay vì lòi ra.
 */
export const SHEET_OVERLAP = ScaleSize(36);

/** Bo hai góc dưới của dải navy, theo thiết kế. */
export const SHEET_CORNER_RADIUS = ScaleSize(14);

/**
 * Bề ngang khung ảnh nền navy: ảnh trải hết chiều ngang màn hình.
 *
 * `HomeHeader` và `HeaderOverlap` nằm ở hai cây khác nhau (header ghim cố
 * định, dải nằm trong vùng cuộn) nhưng phải trông như MỘT mảng nền liền mạch.
 * Cách duy nhất là cả hai vẽ cùng một khung ảnh — cùng bề ngang này, cùng
 * chiều cao `headerHeight + SHEET_OVERLAP` — rồi mỗi view tự cắt phần của
 * mình; nếu để mỗi view tự co ảnh theo kích thước riêng thì tỉ lệ khác nhau và
 * lộ đường nối ngay ở mép dưới header.
 */
export const HEADER_BACKGROUND_WIDTH = Dimensions.get('window').width;
