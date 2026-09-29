import {
  createInitialCreateRequestForm,
  createRequestFormReducer,
  listCreateRequestDrafts,
  parseCreateRequestDraft,
  toCreateRequestDraft,
} from './requests';

const VALID = {
  date: '2026-09-29',
  duration: 'full_day',
  endDate: '2026-09-30',
  endTime: '17:30',
  eventKind: 'late_arrival',
  leaveKind: 'annual',
  note: 'ghi chú',
  place: 'office',
  reason: 'nghỉ việc riêng',
  startDate: '2026-09-29',
  startTime: '08:30',
  type: 'leave',
};

describe('parseCreateRequestDraft', () => {
  it('nhận nháp đúng shape', () => {
    expect(parseCreateRequestDraft(VALID)).toEqual(VALID);
  });

  it('loại nháp của bản app cũ bị thiếu trường', () => {
    // `duration` chưa tồn tại ở bản app cũ — đúng ca mà redux-persist sẽ nạp
    // lên sau một lần nâng cấp.
    const missingDuration: Record<string, unknown> = {
      ...VALID,
      duration: undefined,
    };
    expect(parseCreateRequestDraft(missingDuration)).toBeUndefined();
  });

  it('loại nháp có enum không còn tồn tại', () => {
    expect(
      parseCreateRequestDraft({ ...VALID, place: 'coworking' }),
    ).toBeUndefined();
  });

  it('loại nháp mang loại đơn đã bị gỡ khỏi app', () => {
    expect(parseCreateRequestDraft({ ...VALID, type: 'sick' })).toBeUndefined();
  });

  it('loại undefined / null / chuỗi rác', () => {
    expect(parseCreateRequestDraft(undefined)).toBeUndefined();
    expect(parseCreateRequestDraft(null)).toBeUndefined();
    expect(parseCreateRequestDraft('{}')).toBeUndefined();
  });
});

describe('createRequestFormReducer', () => {
  it('patch chỉ đụng loại đang chọn, bốn loại kia giữ NGUYÊN THAM CHIẾU', () => {
    const initial = createInitialCreateRequestForm();
    const next = createRequestFormReducer(initial, {
      action: 'patch',
      values: { reason: 'xin nghỉ' },
    });

    expect(next.byType.leave.reason).toBe('xin nghỉ');
    // Giữ tham chiếu là điều kiện để useMemo phía hook không tính lại oan.
    expect(next.byType.overtime).toBe(initial.byType.overtime);
  });

  it('patch KHÔNG bump revision — bump là remount mỗi ký tự gõ', () => {
    const initial = createInitialCreateRequestForm();
    const next = createRequestFormReducer(initial, {
      action: 'patch',
      values: { reason: 'a' },
    });

    expect(next.revision).toBe(initial.revision);
  });

  it('change_type bump revision và giữ lại giá trị của loại cũ', () => {
    const initial = createInitialCreateRequestForm();
    const typed = createRequestFormReducer(initial, {
      action: 'patch',
      values: { reason: 'lý do nghỉ phép' },
    });
    const switched = createRequestFormReducer(typed, {
      action: 'change_type',
      requestType: 'overtime',
    });
    const back = createRequestFormReducer(switched, {
      action: 'change_type',
      requestType: 'leave',
    });

    expect(switched.revision).toBe(initial.revision + 1);
    expect(switched.byType.overtime.reason).toBe('');
    expect(back.byType.leave.reason).toBe('lý do nghỉ phép');
  });

  it('change_type về chính nó trả đúng state cũ, không tạo render thừa', () => {
    const initial = createInitialCreateRequestForm();
    expect(
      createRequestFormReducer(initial, {
        action: 'change_type',
        requestType: initial.type,
      }),
    ).toBe(initial);
  });

  it('patch ghi hai đầu trong MỘT nhịp', () => {
    const next = createRequestFormReducer(createInitialCreateRequestForm(), {
      action: 'patch',
      values: { endDate: '2026-10-05', startDate: '2026-10-01' },
    });

    expect(next.byType.leave.startDate).toBe('2026-10-01');
    expect(next.byType.leave.endDate).toBe('2026-10-05');
  });

  it('apply_draft bump revision và chỉ ghi đè loại của nháp', () => {
    const initial = createInitialCreateRequestForm();
    // Dựng draft từ chính helper thay vì từ `VALID`: `VALID` cố ý để kiểu lỏng
    // (các test zod ở trên cần nhét giá trị sai vào), còn action thì đòi đúng
    // `TCreateRequestDraft`.
    const draft = {
      ...toCreateRequestDraft(initial),
      reason: 'từ nháp',
      type: 'overtime',
    } as const;

    const next = createRequestFormReducer(initial, {
      action: 'apply_draft',
      draft,
    });

    expect(next.type).toBe('overtime');
    expect(next.revision).toBe(initial.revision + 1);
    expect(next.byType.overtime.reason).toBe('từ nháp');
    expect(next.byType.leave).toBe(initial.byType.leave);
  });

  it('vòng tròn state -> draft -> zod vẫn khớp format MMKV', () => {
    const draft = toCreateRequestDraft(createInitialCreateRequestForm());
    // Chốt chặn: schema zod và state form không được phép trôi khỏi nhau.
    expect(parseCreateRequestDraft(draft)).toEqual(draft);
  });
});

describe('listCreateRequestDrafts', () => {
  it('bỏ qua nháp hỏng, chỉ đếm cái đọc được', () => {
    const list = listCreateRequestDrafts({
      leave: VALID,
      // Bản app cũ: thiếu `duration`. Đếm 2 rồi mở ra thấy 1 thì khó hiểu hơn
      // là đếm đúng 1.
      overtime: { ...VALID, duration: undefined, type: 'overtime' },
    });

    expect(list).toHaveLength(1);
    expect(list[0]?.type).toBe('leave');
  });

  it('xếp theo CREATE_REQUEST_TYPE_ORDER, không theo thứ tự khoá', () => {
    const list = listCreateRequestDrafts({
      overtime: { ...VALID, type: 'overtime' },
      leave: VALID,
    });

    expect(list.map(draft => draft.type)).toEqual(['leave', 'overtime']);
  });

  it('chịu được undefined / null / giá trị không phải object', () => {
    expect(listCreateRequestDrafts(undefined)).toEqual([]);
    expect(listCreateRequestDrafts(null)).toEqual([]);
    expect(listCreateRequestDrafts('rác')).toEqual([]);
  });
});
