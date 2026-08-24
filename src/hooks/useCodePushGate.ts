import type { UpdatePackage } from 'react-native-codepush-sdk';

import { AppConstants } from '@constants';
import { AppStorage } from '@services/common/storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useCodePush } from 'react-native-codepush-sdk';

// Check phải nhanh vì nó chặn màn hình đầu; download thì cho thoáng hơn vì
// bundle ~6MB. Hết hạn thì mở cổng luôn, không bao giờ chặn app vì OTA.
const CHECK_TIMEOUT_MS = 8000;
const DOWNLOAD_TIMEOUT_MS = 60_000;
const PERCENT_MAX = 100;

// Fail-open cứng. initialize() của SDK không có timeout (await RNFS mkdir + đọc
// AsyncStorage), nếu nó treo thì phase đứng ở 'checking' và app trắng màn hình
// vĩnh viễn. Watchdog bảo đảm luôn vào được app. Được clear ngay khi bắt đầu
// download vì lúc đó DOWNLOAD_TIMEOUT_MS đã lo phần còn lại.
const STARTUP_WATCHDOG_MS = 15_000;

/**
 * Bật tạm để xem màn hình update bằng dữ liệu giả: không gọi server, không tải
 * bundle, không restart — chỉ chạy downloading (0 -> 100%) rồi installing rồi
 * vào app. Dùng khi máy đã ở bản mới nhất nên gate thật luôn bỏ qua.
 *
 * PHẢI trả về false trước khi commit.
 */
const MOCK_UPDATE_SCREEN = false;

/**
 * Bật tạm để chạy lại pipeline THẬT (check -> download -> install) ngay cả khi
 * máy đã ở đúng bản server đang offer, tức bỏ qua isAlreadyApplied. Khác với
 * MOCK_UPDATE_SCREEN ở chỗ nó gọi server và tải bundle thật, nên dùng để verify
 * toàn bộ luồng chứ không chỉ giao diện.
 *
 * Khi bật, gate cố tình KHÔNG restart sau khi cài: guard chống trùng đang bị vô
 * hiệu nên restart sẽ thành vòng lặp cài lại vô hạn ở mỗi launch.
 *
 * PHẢI trả về false trước khi commit.
 */
const FORCE_REINSTALL_UPDATE = false;

const MOCK_TICK_MS = 200;
const MOCK_STEP_PERCENT = 7;
const MOCK_INSTALL_MS = 2500;

export type CodePushGatePhase =
  | 'checking'
  | 'downloading'
  | 'installing'
  | 'ready';

const withTimeout = async <T,>(task: Promise<T>, ms: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('CodePush timeout')), ms);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

// Server hiện trả về update kể cả khi currentPackageHash đã đúng, và
// checkForUpdate của SDK không so hash. Nếu không tự chặn ở đây thì mỗi launch
// sẽ install lại rồi restart -> loop vô hạn.
const isAlreadyApplied = (update: UpdatePackage, currentHash?: string) =>
  !FORCE_REINSTALL_UPDATE &&
  (update.packageHash === currentHash ||
    update.packageHash ===
      AppStorage.getString(AppConstants.CODE_PUSH_LAST_RESTART_HASH_KEY));

/**
 * Chặn ApplicationNavigator tới khi check + install update xong, và check lại
 * mỗi lần app quay lại foreground.
 *
 * Bundle JS không thể hot-swap trong một RN instance đang chạy: native chỉ đọc
 * đường dẫn bundle một lần lúc launch. Nên luồng đúng là gate -> install ->
 * restart, và code mới có hiệu lực ở launch kế tiếp.
 */
export function useCodePushGate() {
  const { codePush } = useCodePush();
  const [phase, setPhase] = useState<CodePushGatePhase>('checking');
  const [progress, setProgress] = useState(0);
  const hasStartedRef = useRef(false);
  const isSyncingRef = useRef(false);
  const hasOpenedGateRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  /**
   * Check + download + install. Trả về true nếu vừa cài một bản mới.
   *
   * `isBlocking` chỉ để quyết định có hiện progress hay không: lúc startup thì
   * có (gate đang chặn navigator), lúc resume thì không (người dùng đang dùng
   * app, không được che UI).
   */
  const syncOnce = useCallback(
    async (isBlocking: boolean) => {
      if (!codePush) {
        return false;
      }
      // checkForUpdate của SDK throw 'Already checking for update' nếu bị gọi
      // lồng nhau, nên chặn chồng lấn giữa startup và các lần resume.
      if (isSyncingRef.current) {
        return false;
      }
      isSyncingRef.current = true;
      try {
        // initialize() phải có timeout: nếu nó treo mà không bọc thì finally
        // không chạy, isSyncingRef kẹt true và MỌI lần resume sau đều bị chặn.
        await withTimeout(codePush.initialize(), CHECK_TIMEOUT_MS);

        const current = await codePush.getCurrentPackage();
        const update = await withTimeout(
          codePush.checkForUpdate(),
          CHECK_TIMEOUT_MS,
        );

        if (!update || isAlreadyApplied(update, current?.packageHash)) {
          return false;
        }

        if (isBlocking && isMountedRef.current) {
          // Splash native do màn Startup ẩn, mà Startup nằm trong navigator
          // đang bị chặn — phải tự ẩn ở đây, nếu không progress view bị che.
          setPhase('downloading');
          SplashScreen.hide();
        }

        const localPackage = await withTimeout(
          codePush.downloadUpdate(update, ({ receivedBytes, totalBytes }) => {
            if (isBlocking && totalBytes > 0 && isMountedRef.current) {
              setProgress(
                Math.round((receivedBytes / totalBytes) * PERCENT_MAX),
              );
            }
          }),
          DOWNLOAD_TIMEOUT_MS,
        );

        // Download qua LAN/loopback có thể xong trong vài chục ms, còn
        // installUpdate (copy bundle + ghi AsyncStorage + POST
        // logUpdateInstallation lên server) tốn tới vài giây. Tách phase để
        // giai đoạn dài đó có trạng thái riêng, không để progress đứng im.
        if (isBlocking && isMountedRef.current) {
          setPhase('installing');
        }
        await codePush.installUpdate(localPackage);

        // Chốt hash: kể cả khi SDK ghi currentPackage thất bại, launch sau vẫn
        // không cài lại cùng một bản.
        AppStorage.set(
          AppConstants.CODE_PUSH_LAST_RESTART_HASH_KEY,
          update.packageHash,
        );
        return true;
      } finally {
        isSyncingRef.current = false;
      }
    },
    [codePush],
  );

  // Startup: chạy đúng một lần, chặn navigator tới khi xong.
  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    if (MOCK_UPDATE_SCREEN) {
      hasStartedRef.current = true;
      hasOpenedGateRef.current = false;
      setPhase('downloading');
      SplashScreen.hide();

      let percent = 0;
      let installTimer: ReturnType<typeof setTimeout> | undefined;
      const tick = setInterval(() => {
        percent = Math.min(percent + MOCK_STEP_PERCENT, PERCENT_MAX);
        setProgress(percent);
        if (percent >= PERCENT_MAX) {
          clearInterval(tick);
          setPhase('installing');
          installTimer = setTimeout(() => {
            setPhase('ready');
            hasOpenedGateRef.current = true;
          }, MOCK_INSTALL_MS);
        }
      }, MOCK_TICK_MS);

      return () => {
        clearInterval(tick);
        if (installTimer) {
          clearTimeout(installTimer);
        }
      };
    }

    if (!codePush) {
      return;
    }
    hasStartedRef.current = true;

    let watchdog: ReturnType<typeof setTimeout> | undefined;

    const clearWatchdog = () => {
      if (watchdog) {
        clearTimeout(watchdog);
        watchdog = undefined;
      }
    };

    // Chỉ đánh dấu đã mở cổng khi thật sự mở, vì cờ này quyết định có
    // restartApp() hay không.
    const openGate = () => {
      if (!isMountedRef.current) {
        return;
      }
      hasOpenedGateRef.current = true;
      setPhase('ready');
    };

    const runStartup = async () => {
      try {
        const hasInstalled = await syncOnce(true);
        if (!isMountedRef.current) {
          return;
        }
        // Nếu watchdog đã mở cổng thì người dùng đang dùng app rồi — không
        // restart giữa session, để bundle mới áp dụng ở lần mở app kế tiếp.
        // FORCE_REINSTALL_UPDATE cũng không restart: guard chống trùng đang tắt
        // nên restart sẽ thành vòng lặp cài lại ở mỗi launch.
        if (
          hasInstalled &&
          !hasOpenedGateRef.current &&
          !FORCE_REINSTALL_UPDATE
        ) {
          codePush.restartApp();
          return;
        }
        openGate();
      } catch (error) {
        // Update lỗi thì vẫn phải vào được app bằng bundle hiện tại.
        console.warn('CodePush startup gate failed:', error);
        openGate();
      } finally {
        clearWatchdog();
      }
    };

    watchdog = setTimeout(openGate, STARTUP_WATCHDOG_MS);
    void runStartup();

    return clearWatchdog;
  }, [codePush, syncOnce]);

  // Subscription phải nằm ở effect riêng: gộp chung với startup thì lần chạy
  // sau của effect sẽ bị hasStartedRef chặn ngay đầu, listener đã bị cleanup gỡ
  // mà không bao giờ được đăng ký lại -> resume check chết im lặng.
  //
  // Mở lại app từ background không phải cold start: JS instance vẫn sống nên
  // startup không chạy lại. Check ngầm ở đây, không chặn UI và không restart
  // giữa session — bundle mới áp dụng ở lần mở app kế tiếp.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && hasOpenedGateRef.current) {
        syncOnce(true).catch((error: unknown) => {
          console.warn('CodePush resume sync failed:', error);
        });
      }
    });

    return () => subscription.remove();
  }, [syncOnce]);

  return { phase, progress };
}
