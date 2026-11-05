"use strict";
const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("saadEmu",Object.freeze({
 environment:()=>ipcRenderer.invoke("lab:environment"),
 chooseFolder:title=>ipcRenderer.invoke("lab:choose-folder",title),
 chooseFile:(title,type)=>ipcRenderer.invoke("lab:choose-file",title,type),
 scanGames:folders=>ipcRenderer.invoke("lab:scan-games",folders),
 launchGame:options=>ipcRenderer.invoke("lab:launch-game",options),
 runTests:selection=>ipcRenderer.invoke("lab:run",selection),
 saveReport:report=>ipcRenderer.invoke("lab:save-report",report),
 openExternal:url=>ipcRenderer.invoke("lab:open-external",url),
 onLaunchError:callback=>ipcRenderer.on("lab:launch-error",(_event,data)=>callback(data))
}));
