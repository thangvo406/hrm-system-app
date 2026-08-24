import type { PropsWithChildren } from 'react';

import UpdateProgressView from '@components/UpdateProgressView';
import { useCodePushGate } from '@hooks/useCodePushGate';

/**
 * Giữ ApplicationNavigator chưa mount tới khi check + install update xong.
 *
 * - `checking`: chưa render gì, để splash native đứng nguyên (thường chỉ vài
 *   trăm ms) nên không bị nháy màn hình khi không có update.
 * - `downloading` / `installing`: hook đã ẩn splash, hiện tiến độ.
 * - `ready`: render app bình thường.
 */
function CodePushGate({ children }: PropsWithChildren) {
  const { phase, progress } = useCodePushGate();

  if (phase === 'checking') {
    return null;
  }

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
