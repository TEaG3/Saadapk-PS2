"use strict";
const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("saadLab",Object.freeze({
 environment:()=>ipcRenderer.invoke("lab:environment"),
 chooseFolder:title=>ipcRenderer.invoke("lab:choose-folder",title),
 chooseFile:title=>ipcRenderer.invoke("lab:choose-file",title),
 run:selection=>ipcRenderer.invoke("lab:run",selection),
 validateTarget:p=>ipcRenderer.invoke("lab:validate-target",p),
 saveReport:report=>ipcRenderer.invoke("lab:save-report",report),
 openExternal:url=>ipcRenderer.invoke("lab:open-external",url)
}));
