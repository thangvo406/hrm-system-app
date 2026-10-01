import type { RootScreenProps } from '@navigation/types';
import type { TSelectionItem } from '@type/dialog';
import type {
  TApprovalStep,
  TCreateRequestFormValues,
  TCreateRequestSection,
  TDatePickMode,
  TLeaveBalance,
  TRequestDateRange,
  TRequestType,
} from '@type/requests';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import DateRangeSheet from '@dialogs/DateRangeSheet';
import dayjs from 'dayjs';
import Selection from '@dialogs/Selection';
import { REQUEST_TYPE_STYLES } from '@screens/Requests/requestTypes';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { RequestsSelector } from '@services/selectors';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { saveDraftRequest } from '@services/slices/requests/requestsSlice';
import { useTranslation } from 'react-i18next';
import {
  BALANCE_LABEL_KEYS,
  countHours,
  countLeaveDays,
  CREATE_REQUEST_REASON_LABEL_KEYS,
  CREATE_REQUEST_REASON_PLACEHOLDER_KEYS,
  CREATE_REQUEST_SECTIONS,
  CREATE_REQUEST_TITLE_KEYS,
  CREATE_REQUEST_TYPE_ORDER,
  createInitialCreateRequestForm,
  createRequestFormReducer,
  EVENT_KIND_LABEL_KEYS,
  EVENT_KIND_ORDER,
  findMissingSections,
  LEAVE_KIND_LABEL_KEYS,
  LEAVE_KIND_ORDER,
  LEAVE_KIND_SOURCES,
  listCreateRequestDrafts,
  parseCreateRequestDraft,
  SINGLE_DATE_LABEL_KEYS,
  toCreateRequestDraft,
  WORK_PLACE_LABEL_KEYS,
  WORK_PLACE_ORDER,
} from '@utils/requests';
import imageNames from '@assets/images/names';
import { ImagePicker } from '@utils/imagePicker';
import { ValidateUtils } from '@kits/core/utils';
import { pick } from '@react-native-documents/picker';

const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';
const { checkValidFile, getFileName } = ValidateUtils;
const BALANCES: readonly TLeaveBalance[] = [];
const APPROVERS: readonly TApprovalStep[] = [];

/** Khối chỉ dựng được khi đã có số dư phép từ server. */
const BALANCE_DEPENDENT_SECTIONS: readonly TCreateRequestSection[] = [
  'balances',
  'summary',
];

type Properties = RootScreenProps<Paths.CreateRequest>;

export function useCreateRequest(props: Properties) {
  const { type: initialType } = AppNavigator.getParams(props) as {
    type?: TRequestType;
  };

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [form, dispatchForm] = useReducer(
    createRequestFormReducer,
    undefined,
    createInitialCreateRequestForm,
  );
  const [, setErrorUploadFile] = useState<any>(null);
  const [filesUpload, setFileUpload] = useState<any>({});

  const { byType, revision, type } = form;
  const {
    date,
    duration,
    endDate,
    endTime,
    eventKind,
    leaveKind,
    note,
    place,
    reason,
    startDate,
    startTime,
  } = byType[type];

  const setField = useCallback(
    <K extends keyof TCreateRequestFormValues>(field: K) =>
      (value: TCreateRequestFormValues[K]) => {
        dispatchForm({ action: 'patch', values: { [field]: value } });
      },
    [],
  );

  const DATA_SELECTION_DOCUMENT = useMemo(() => {
    return [
      {
        title: t('common.popup.upload_file.audio'),
        type: 'image',
        icon: imageNames.ic_gallery_gray,
        imageType: 'image',
      },
      {
        title: t('common.popup.upload_file.file'),
        type: 'file',
        imageType: 'image',
        icon: imageNames.ic_upload_doc,
      },
    ];
  }, [t]);

  const setType = useCallback((requestType: TRequestType) => {
    dispatchForm({ action: 'change_type', requestType });
  }, []);

  const [dismissedTypes, setDismissedTypes] = useState<
    ReadonlySet<TRequestType>
  >(() => new Set());

  const sections = useMemo(() => {
    const enabled = new Set<TCreateRequestSection>(
      CREATE_REQUEST_SECTIONS[type],
    );
    if (BALANCES.length === 0) {
      for (const section of BALANCE_DEPENDENT_SECTIONS) {
        enabled.delete(section);
      }
    }
    return enabled;
  }, [type]);

  const source = LEAVE_KIND_SOURCES[leaveKind];

  const totalDays = useMemo(
    () => countLeaveDays(startDate, endDate, duration),
    [duration, endDate, startDate],
  );

  const totalHours = useMemo(
    () => countHours(startTime, endTime),
    [endTime, startTime],
  );

  const remainingDays = useMemo(() => {
    const balance = BALANCES.find(item => item.kind === source);
    // Nghỉ không lương không có hạn mức nên không có gì để trừ.
    return balance?.days === undefined ? 0 : balance.days - totalDays;
  }, [source, totalDays]);

  const openPicker = useCallback(
    <T extends string>(
      options: readonly T[],
      labelKeys: Readonly<Record<T, string>>,
      selected: T,
      onSelect: (option: T) => void,
      title: string,
      icons?: Readonly<Partial<Record<T, TSelectionItem['icon']>>>,
    ) => {
      const items: readonly TSelectionItem[] = options.map(option => ({
        icon: icons?.[option],
        id: option,
        label: t(labelKeys[option]),
      }));

      AppNavigator.showDialog({
        screen: Selection,
        popupType: 'bottomSheet',
        items,

        itemSelected: items.find(item => item.id === selected),
        onSelect: (item: TSelectionItem) => {
          const picked = options.find(option => option === item.id);
          if (picked) {
            onSelect(picked);
          }
        },
        pathDisplay: 'label',
        pathSelected: 'id',
        showSearchBar: false,
        title,
      });
    },
    [t],
  );

  const onPickType = useCallback(() => {
    const labelKeys = Object.fromEntries(
      CREATE_REQUEST_TYPE_ORDER.map(option => [
        option,
        REQUEST_TYPE_STYLES[option].labelKey,
      ]),
    ) as Record<TRequestType, string>;
    const icons = Object.fromEntries(
      CREATE_REQUEST_TYPE_ORDER.map(option => [
        option,
        REQUEST_TYPE_STYLES[option].icon,
      ]),
    ) as Record<TRequestType, TSelectionItem['icon']>;

    openPicker(
      CREATE_REQUEST_TYPE_ORDER,
      labelKeys,
      type,
      setType,
      t('create_request.type_label'),
      icons,
    );
  }, [openPicker, t, type]);

  const onPickLeaveKind = useCallback(() => {
    openPicker(
      LEAVE_KIND_ORDER,
      LEAVE_KIND_LABEL_KEYS,
      leaveKind,
      setField('leaveKind'),
      t('create_request.kind_label'),
    );
  }, [leaveKind, openPicker, setField, t]);

  const onPickPlace = useCallback(() => {
    openPicker(
      WORK_PLACE_ORDER,
      WORK_PLACE_LABEL_KEYS,
      place,
      setField('place'),
      t('create_request.place_label'),
    );
  }, [openPicker, place, setField, t]);

  const onPickEventKind = useCallback(() => {
    openPicker(
      EVENT_KIND_ORDER,
      EVENT_KIND_LABEL_KEYS,
      eventKind,
      setField('eventKind'),
      t('create_request.event_label'),
    );
  }, [eventKind, openPicker, setField, t]);

  const openDateSheet = useCallback(
    (mode: TDatePickMode) => {
      const isSingle = mode === 'single';

      AppNavigator.showDialog({
        screen: DateRangeSheet,
        dateType: mode,
        popupType: 'bottomSheet',
        onConfirm: (range: TRequestDateRange) => {
          dispatchForm({
            action: 'patch',
            values: isSingle
              ? { date: range.from }
              : { endDate: range.to, startDate: range.from },
          });
        },
        title: isSingle
          ? t(SINGLE_DATE_LABEL_KEYS[type])
          : t('create_request.date_range_label'),
        value: isSingle
          ? { from: date, to: date }
          : { from: startDate, to: endDate },
      });
    },
    [date, endDate, startDate, t, type],
  );

  const onPickSingleDate = useCallback(() => {
    openDateSheet('single');
  }, [openDateSheet]);

  const onPickDateRange = useCallback(() => {
    openDateSheet('range');
  }, [openDateSheet]);

  /** Cùng `Selection` với các ô chọn khác, chỉ khác nhánh `timeSheet`. */
  const openTimeSheet = useCallback(
    (value: string, onConfirm: (time: string) => void, title: string) => {
      AppNavigator.showDialog({
        screen: Selection,
        popupType: 'bottomSheet',
        onConfirm,
        title,
        type: 'timeSheet',
        value,
      });
    },
    [],
  );

  const onPickStartTime = useCallback(() => {
    openTimeSheet(
      startTime,
      setField('startTime'),
      t('create_request.start_time_label'),
    );
  }, [openTimeSheet, setField, startTime, t]);

  const onPickEndTime = useCallback(() => {
    openTimeSheet(
      endTime,
      setField('endTime'),
      t('create_request.end_time_label'),
    );
  }, [endTime, openTimeSheet, setField, t]);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  const onSaveDraft = useCallback(() => {
    dispatch(saveDraftRequest(toCreateRequestDraft(form)));
    AppNavigator.showSnackBar({
      message: 'Lưu nháp thành công',
      type: 'success',
    });
    AppNavigator.goBack();
  }, [dispatch, form, type]);

  const onExecuteCheckFileUpload = (res: any, isPhoto = false) => {
    const error = checkValidFile(res);
    if (error) {
      if (error.type == 'limit') {
        AppNavigator.showToast({
          message: t('onus_detail.limit_size_error'),
          type: 'error',
        });
      }
      if (error.type == 'extension') {
        AppNavigator.showToast({
          message: t('onus_detail.error_file_extension'),
          type: 'error',
        });
      }
      return;
    }
    setErrorUploadFile(null);
    //  setEnableBtnSubmit(true);
    setFileUpload((prev: any) => {
      res._name = isPhoto ? res.filename : res.name;
      return { ...prev, ...res };
    });
  };

  const handleDocumentItemSelected = (item: any) => {
    if (item?.type == 'image') {
      ImagePicker.openLibrary()
        .then(result => {
          const fileName = result?.filename || getFileName(result?.path);
          onExecuteCheckFileUpload(
            {
              // fileName: fileName,
              filename: fileName,
              name: fileName,
              type: result?.mime || result?.mimeType || result?.type,
              size: result?.size,
              uri: result?.path,
            },
            true,
          );
        })
        .catch(() => {});
    } else {
      pick({
        mode: 'open',
        // type: [
        //   types.zip,
        //   types.audio,
        //   types.video,
        //   types.images,
        //   types.pdf,
        //   types.docx,
        //   types.doc,
        //   types.xls,
        //   types.xlsx,
        //   types.ppt,
        //   types.pptx,
        // ],
      })
        .then(result => {
          const [res] = result || [];
          onExecuteCheckFileUpload(res);
        })
        .catch(() => {});
    }
  };

  const onPickAttachment = useCallback(() => {
    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      items: DATA_SELECTION_DOCUMENT,
      pathDisplay: 'title',
      pathSelected: 'title',
      onSelect: handleDocumentItemSelected,
      showSearchBar: false,
      title: t('common.popup.upload_file.title'),
    });
  }, []);
  const onSubmit = useCallback(() => {}, []);

  const storedDraft = useAppSelector(RequestsSelector.getDraft(type));
  const allDrafts = useAppSelector(RequestsSelector.getDrafts);

  const initialDrafts = useMemo(
    () => listCreateRequestDrafts(allDrafts),
    [allDrafts],
  );

  const savedDraft = useMemo(
    () => parseCreateRequestDraft(storedDraft),
    [storedDraft],
  );

  const onApplyDraft = useCallback(() => {
    if (!savedDraft) {
      return;
    }
    dispatchForm({ action: 'apply_draft', draft: savedDraft });

    setDismissedTypes(previous => new Set(previous).add(savedDraft.type));
  }, [savedDraft]);

  /**
   * Mở màn kèm `type` (bấm một nháp ở màn danh sách đơn) thì đặt luôn loại đó
   * và nạp nháp của nó — người dùng không phải bấm "Cập nhật" thêm lần nữa.
   *
   * `useRef` chốt lại để chỉ chạy đúng một lần: thiếu nó thì mỗi lần
   * `savedDraft` đổi (tức là mỗi lần bấm Lưu nháp) form lại bị nạp đè.
   */
  const hasAppliedInitialRef = useRef(false);

  useEffect(() => {
    if (hasAppliedInitialRef.current || initialType === undefined) {
      return;
    }
    hasAppliedInitialRef.current = true;

    const initialDraft = initialDrafts.find(
      draft => draft.type === initialType,
    );

    dispatchForm(
      initialDraft
        ? { action: 'apply_draft', draft: initialDraft }
        : { action: 'change_type', requestType: initialType },
    );
    setDismissedTypes(previous => new Set(previous).add(initialType));
  }, [initialDrafts, initialType]);

  const missingSections = useMemo(
    () => findMissingSections(type, { date, reason, totalDays, totalHours }),
    [date, reason, totalDays, totalHours, type],
  );

  return {
    approvers: APPROVERS,
    balances: BALANCES,
    canSubmit: missingSections.length === 0,
    formKey: revision,
    hasDraft: savedDraft !== undefined && !dismissedTypes.has(type),
    keys: {
      reasonLabel: CREATE_REQUEST_REASON_LABEL_KEYS[type],
      reasonPlaceholder: CREATE_REQUEST_REASON_PLACEHOLDER_KEYS[type],
      singleDateLabel: SINGLE_DATE_LABEL_KEYS[type],
      sourceLabel: BALANCE_LABEL_KEYS[source],
      title: CREATE_REQUEST_TITLE_KEYS[type],
    },
    labels: {
      date: dayjs(date).format(DISPLAY_DATE_FORMAT),
      endDate: dayjs(endDate).format(DISPLAY_DATE_FORMAT),
      eventKind: t(EVENT_KIND_LABEL_KEYS[eventKind]),
      leaveKind: t(LEAVE_KIND_LABEL_KEYS[leaveKind]),
      place: t(WORK_PLACE_LABEL_KEYS[place]),
      startDate: dayjs(startDate).format(DISPLAY_DATE_FORMAT),
      type: t(REQUEST_TYPE_STYLES[type].labelKey),
    },
    duration,
    endTime,
    filesUpload,
    note,
    onGoBack,
    onPickAttachment,
    onPickDateRange,
    onPickSingleDate,
    onPickEndTime,
    onPickEventKind,
    onPickLeaveKind,
    onPickPlace,
    onPickStartTime,
    onApplyDraft,
    onPickType,
    onSaveDraft,
    onSubmit,
    reason,
    remainingDays,
    sections,
    setField,
    source,
    startTime,
    totalDays,
    totalHours,
  };
}
