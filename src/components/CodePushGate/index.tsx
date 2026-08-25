import type { PropsWithChildren } from 'react';

import UpdateProgressView from '@components/UpdateProgressView';
import { useCodePushGate } from '@hooks/useCodePushGate';
import { FileManager } from '@kits/core/utils/FileManager';

type Properties = PropsWithChildren<{
  /**
   * Timeout theo khoảng lặng giữa các lần nhận thêm dữ liệu khi tải bundle —
   * xem giải thích ở DEFAULT_DOWNLOAD_STALL_TIMEOUT_MS trong
   * useCodePushGate.ts.
   */
  readonly downloadStallTimeoutMs?: number;
}>;

/**
 * Giữ ApplicationNavigator chưa mount tới khi check + install update xong.
 *
 * - `checking`: chưa render gì, để splash native đứng nguyên (thường chỉ vài
 *   trăm ms) nên không bị nháy màn hình khi không có update.
 * - `downloading` / `installing`: hook đã ẩn splash, hiện tiến độ.
 * - `ready`: render app bình thường.
 */
function CodePushGate({ children, downloadStallTimeoutMs }: Properties) {
  const { phase, progress } = useCodePushGate({ downloadStallTimeoutMs });
  console.log('phase', phase);
  FileManager.appendLog('phase', phase);
  if (phase === 'checking') {
    return null;
  }
  console.log('render UpdateProgressView', phase);
  FileManager.appendLog('render UpdateProgressView', phase);
  if (phase === 'downloading' || phase === 'installing') {
    return (
      <UpdateProgressView
        isInstalling={phase === 'installing'}
        progress={progress}
      />
    );
  }

  return <>{children}</>;
}

export default CodePushGate;
