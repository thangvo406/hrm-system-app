import dayjs from 'dayjs';
// import RNFetchBlob from 'react-native-blob-util'
import fs from 'react-native-fs';

// const fs = RNFetchBlob.fs;
// const docPath = fs.dirs.DocumentDir;
const docPath = fs.DocumentDirectoryPath;
const rootPath = docPath + '/hrm_system/';
const getPathFile = (path: string) => {
  return rootPath + path;
};

const destination = getPathFile('log_app.txt');

const checkExistPath = (path: string) => {
  if (!path) {
    return Promise.resolve(false);
  }
  return fs.exists(path);
};

const clearFolderCache = () => {
  fs.unlink(rootPath)
    .then(() => {
      console.warn('clear folder cache success');
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('clear folder cache failed: ' + message);
    });
};

const copyFile = async (sourcePath: string, destinationPath: string) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(sourcePath, destinationPath)
      .then(() => resolve({}))
      .catch(() => reject(new Error(`copyFile failed: ${sourcePath}`)));
  });
};
const checkExitsAndCreateFolderApp = () => {
  return new Promise(resolve => {
    fs.exists(rootPath)
      .then(dirExists => {
        if (!dirExists) {
          void fs.mkdir(rootPath).then(resolve);
        } else {
          resolve({});
        }
      })
      .catch(resolve);
  });
};
// Luôn resolve: không tạo được file log thì app vẫn phải chạy bình thường.
const checkExistAndCreateLog = async () => {
  try {
    await checkExitsAndCreateFolderApp();
    const exists = await fs.exists(destination);
    if (!exists) {
      await fs.writeFile(destination, 'create file', 'utf8');
    }
  } catch {
    // bỏ qua
  }
  return {};
};

// Nhiều appendLog gọi gần như cùng lúc (vd ngay sau nhau trong cùng một hàm
// async) có thể đua nhau ghi file — mỗi lần gọi độc lập tự đọc/ghi native, nên
// lần ghi sau có thể đè mất lần ghi trước nếu không serialize. Xếp hàng qua
// một promise chain để đảm bảo luôn ghi tuần tự, không lần nào bị mất.
let writeQueue: Promise<unknown> = Promise.resolve();

const appendLog = (type: string, content: string) => {
  const now = dayjs().toString();
  const message = `\n${now}  ${type}  ${content}`;
  writeQueue = writeQueue
    .then(() => fs.appendFile(destination, message, 'utf8'))
    .catch(() => undefined);
};

const readFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8').then(resolve).catch(reject);
  });
};

export const FileManager = {
  checkExistPath,
  checkExistAndCreateLog,
  appendLog,
  pathFileLog: destination,
  copyFile,
  getPathFile,
  readFile,
  clearFolderCache,
};
