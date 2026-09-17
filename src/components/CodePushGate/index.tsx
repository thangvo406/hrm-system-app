import type { PropsWithChildren } from 'react';

import UpdateProgressView from '@components/UpdateProgressView';
import { useCodePushGate } from '@hooks/useCodePushGate';
import { FileManager } from '@kits/core/utils/FileManager';

type Properties = PropsWithChildren<{
  /** Xem giải thích ở getDownloadTimeoutMs trong useCodePushGate.ts. */
  readonly minDownloadKbps?: number;
  /** Xem giải thích ở getDownloadTimeoutMs trong useCodePushGate.ts. */
  readonly downloadTimeoutBufferMs?: number;
}>;

/**
 * Giữ ApplicationNavigator chưa mount tới khi check + install update xong.
 *
 * - `checking`: chưa render gì, để splash native đứng nguyên (thường chỉ vài
 *   trăm ms) nên không bị nháy màn hình khi không có update.
 * - `downloading` / `installing`: hook đã ẩn splash, hiện tiến độ.
 * - `ready`: render app bình thường.
 */
function CodePushGate({
  children,
  minDownloadKbps,
  downloadTimeoutBufferMs,
}: Properties) {
  const { phase, progress } = useCodePushGate({
    minDownloadKbps,
    downloadTimeoutBufferMs,
  });
  FileManager.appendLog('phase', phase);
  if (phase === 'checking') {
    return null;
  }
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
