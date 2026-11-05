"use strict";
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const os = require("node:os");
const { spawn } = require("node:child_process");
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
  ipcMain.handle("lab:choose-file",async(_e,title,type="exe")=>{const filters=type==="game"?[{name:"PS2 game images",extensions:["iso","chd","zso","cso"]}]:[{name:"Windows executable",extensions:["exe"]}];const r=await dialog.showOpenDialog(win,{title,properties:["openFile"],filters});return r.canceled?null:r.filePaths[0];});
  ipcMain.handle("lab:run",async(_e,selection)=>runSuite(selection||{}));
  ipcMain.handle("lab:validate-target",async(_e,p)=>validateTarget(p));
  ipcMain.handle("lab:launch-emulator",async(_e,{emulatorPath,gamePath}={})=>{
    if(process.platform!=="win32")throw new Error("تشغيل المحاكي متاح في إصدار Windows فقط.");
    if(!emulatorPath||!gamePath)throw new Error("حدد ملف PCSX2 وملف لعبة محلي تملكه.");
    const exe=path.resolve(emulatorPath),game=path.resolve(gamePath);
    const [es,gs]=await Promise.all([fs.stat(exe),fs.stat(game)]);
    if(!es.isFile()||path.extname(exe).toLowerCase()!==".exe")throw new Error("ملف المحاكي غير صالح.");
    if(!gs.isFile()||![".iso",".chd",".zso",".cso"].includes(path.extname(game).toLowerCase())||gs.size===0)throw new Error("ملف اللعبة غير صالح أو فارغ.");
    const logDir=path.join(app.getPath("userData"),"logs");await fs.mkdir(logDir,{recursive:true});
    const logPath=path.join(logDir,"emulator-"+Date.now()+".log"),log=await fs.open(logPath,"a");
    await log.appendFile("Saad PS2 Test Lab emulator launch\nExecutable: "+exe+"\nGame: "+game+"\nStarted: "+new Date().toISOString()+"\n");
    return await new Promise((resolve,reject)=>{
      const child=spawn(exe,["-batch","-fullscreen",game],{cwd:path.dirname(exe),windowsHide:false,stdio:["ignore","pipe","pipe"]});
      child.stdout.on("data",d=>log.appendFile(d).catch(()=>{}));
      child.stderr.on("data",d=>log.appendFile(d).catch(()=>{}));
      child.once("error",async err=>{await log.appendFile("\nSPAWN ERROR: "+err.message);await log.close();reject(err);});
      child.once("close",async(code,signal)=>{await log.appendFile("\nExited: "+new Date().toISOString()+"\nExit code: "+code+"\nSignal: "+signal);await log.close();resolve({launched:true,exitCode:code,signal,logPath,gamePath:game,emulatorPath:exe});});
    });
  });
  ipcMain.handle("lab:save-report",async(_e,report)=>{const r=await dialog.showSaveDialog(win,{title:"حفظ تقرير المختبر",defaultPath:"saad-ps2-test-report.json",filters:[{name:"JSON",extensions:["json"]}]});if(r.canceled||!r.filePath)return {saved:false};await fs.writeFile(r.filePath,JSON.stringify(report,null,2),"utf8");return {saved:true,filePath:r.filePath};});
  ipcMain.handle("lab:open-external",async(_e,url)=>{const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw new Error("Only HTTP(S) links are allowed.");await shell.openExternal(u.toString());return true;});
  createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
