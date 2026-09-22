import axios from 'axios';
import { useEffect } from 'react';
import { Globals } from '@utils';
import dayjs from 'dayjs';
import { FileManager } from '@kits/core/utils/FileManager';

const SYNC_INTERVAL_MS = 60_000;

/**
 * Ghi lại giờ máy chủ kèm mốc đồng hồ thiết bị tại thời điểm nhận được.
 *
 * Hai giá trị phải đi cùng nhau: `getCurrentTime()` lấy hiệu của chúng để bù
 * phần đã trôi giữa hai lần đồng bộ.
 */
const setServerTime = (serverTime: string) => {
  Globals.currentTime = serverTime;
  Globals.currentTimeSyncedAt = Date.now();
};

const useTime = () => {
  useEffect(() => {
    const execute = async () => {
      try {
        const response = await axios.head(
          'https://clients3.google.com/generate_204',
          {
            timeout: 1000,
          },
        );
        FileManager.appendLog(
          'useTime',
          'get time from google: ' + response.headers.date,
        );
        setServerTime(response.headers.date);
      } catch {
        try {
          const responseCloudFlare = await axios.get(
            'https://cloudflare.com/cdn-cgi/trace',
            {
              timeout: 1000,
            },
          );
          FileManager.appendLog(
            'useTime',
            'get time from cloudflare: ' + responseCloudFlare.headers.date,
          );
          setServerTime(responseCloudFlare.headers.date);
        } catch {
          //TODO: handle error
          setServerTime(dayjs().toISOString());
          // console.log('error get time', error.message);
        }
      }
    };
    // `void` để không dính @typescript-eslint/no-floating-promises: lỗi mạng đã
    // được nuốt trong `execute`, ở đây không còn gì để chờ.
    void execute();
    const intervalId = setInterval(() => void execute(), SYNC_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);
};

export default useTime;
