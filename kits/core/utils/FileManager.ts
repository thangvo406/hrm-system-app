
import dayjs from 'dayjs';
// import RNFetchBlob from 'react-native-blob-util'
import fs from 'react-native-fs';


// const fs = RNFetchBlob.fs;
// const docPath = fs.dirs.DocumentDir;
const docPath = fs.DocumentDirectoryPath;
const rootPath = docPath + '/ischool/';
const getPathFile = (path: string) => {
    return rootPath + `${path}`;
};

const destination = getPathFile('log_app.txt');

const checkExistPath = (path: string) => {
    if(!path){
        return Promise.resolve(false);
    }
    return fs.exists(path);
};

const clearFolderCache = () => {
    fs.unlink(rootPath)
    .then(res => {
        // alert("clear success: "+ JSON.stringify(res))
        console.warn('clear folder cache success');
    })
    .catch(error => {
        console.warn('clear folder cache failed: ' + error?.message);
    });
};

const copyFile = async (sourcePath: string, destinationPath: string) => {
    return new Promise((resolve,reject)=>{
        fs.copyFile(sourcePath, destinationPath)
            .then(() => resolve({}))
            .catch(() => reject({}));
    });
  };
const checkExitsAndCreateFolderApp = () => {
    return new Promise((resolve)=>{
        fs.exists(rootPath)
            .then(dirExists => {
                if(!dirExists) {
                    fs.mkdir(rootPath).then(resolve);
                }else {
                    resolve({});
                }
            })
            .catch(resolve);
    });
};
const checkExistAndCreateLog = () => {
    return new Promise(async (resolve)=>{
     try {
         await checkExitsAndCreateFolderApp();
         const exists = await fs.exists(destination);
         if(!exists) {
            await fs.writeFile(destination, 'create file', 'utf8');
            resolve({});
         }else {
             resolve({});
         }
     } catch {
         resolve({});
     }
    });
 };

 const appendLog = (type: string, content: string) => {
    const now = dayjs().toString();
    const message = `\n${now}  ${type}  ${content}`;
    fs.appendFile(destination, message, 'utf8')
        .then(()=> null);
};

const readFile = (filePath: string) => {
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath, 'utf8')
            .then(resolve)
            .catch(reject);
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
