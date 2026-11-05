"use strict";
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const os = require("node:os");
const { runSuite } = require("../src/main/runner.cjs");
const { validateTarget } = require("../src/main/checks/target.cjs");
let win;
function createWindow() {
  win = new BrowserWindow({width:1440,height:940,minWidth:1000,minHeight:700,backgroundColor:"#08111f",
    webPreferences:{preload:path.join(__dirname,"preload.cjs"),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  win.loadFile(path.join(__dirname,"../src/renderer/index.html"));
}
app.whenReady().then(()=>{
  ipcMain.handle("lab:environment",()=>({platform:process.platform,release:os.release(),arch:process.arch,version:app.getVersion(),cpus:os.cpus().length,totalMemory:os.totalmem(),freeMemory:os.freemem()}));
  ipcMain.handle("lab:choose-folder",async(_e,title)=>{const r=await dialog.showOpenDialog(win,{title,properties:["openDirectory","createDirectory"]});return r.canceled?null:r.filePaths[0];});
  ipcMain.handle("lab:choose-file",async(_e,title)=>{const r=await dialog.showOpenDialog(win,{title,properties:["openFile"],filters:[{name:"Windows executable",extensions:["exe"]}]});return r.canceled?null:r.filePaths[0];});
  ipcMain.handle("lab:run",async(_e,selection)=>runSuite(selection||{}));
  ipcMain.handle("lab:validate-target",async(_e,p)=>validateTarget(p));
  ipcMain.handle("lab:save-report",async(_e,report)=>{const r=await dialog.showSaveDialog(win,{title:"حفظ تقرير المختبر",defaultPath:"saad-ps2-test-report.json",filters:[{name:"JSON",extensions:["json"]}]});if(r.canceled||!r.filePath)return {saved:false};await fs.writeFile(r.filePath,JSON.stringify(report,null,2),"utf8");return {saved:true,filePath:r.filePath};});
  ipcMain.handle("lab:open-external",async(_e,url)=>{const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw new Error("Only HTTP(S) links are allowed.");await shell.openExternal(u.toString());return true;});
  createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
