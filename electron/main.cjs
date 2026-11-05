"use strict";
const {app,BrowserWindow,ipcMain,dialog,shell}=require("electron");
const path=require("node:path");
const fs=require("node:fs/promises");
const os=require("node:os");
const {spawn}=require("node:child_process");
const {runSuite}=require("../src/main/runner.cjs");
const {validateTarget}=require("../src/main/checks/target.cjs");
const {scanGameFolders}=require("../src/main/library.cjs");
let win;
function createWindow(){
 win=new BrowserWindow({width:1500,height:950,minWidth:1050,minHeight:720,backgroundColor:"#080f1b",
  webPreferences:{preload:path.join(__dirname,"preload.cjs"),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.loadFile(path.join(__dirname,"../src/renderer/index.html"));
}
app.whenReady().then(()=>{
 ipcMain.handle("lab:environment",()=>({platform:process.platform,release:os.release(),arch:process.arch,version:app.getVersion(),cpus:os.cpus().length,totalMemory:os.totalmem(),freeMemory:os.freemem()}));
 ipcMain.handle("lab:choose-folder",async(_e,title)=>{const r=await dialog.showOpenDialog(win,{title,properties:["openDirectory","createDirectory"]});return r.canceled?null:r.filePaths[0];});
 ipcMain.handle("lab:choose-file",async(_e,title,type="exe")=>{const filters=type==="game"?[{name:"PS2 game images",extensions:["iso","chd","zso","cso"]}]:[{name:"PCSX2 executable",extensions:["exe"]}];const r=await dialog.showOpenDialog(win,{title,properties:["openFile"],filters});return r.canceled?null:r.filePaths[0];});
 ipcMain.handle("lab:scan-games",async(_e,folders)=>scanGameFolders(folders||[]));
 ipcMain.handle("lab:run",async(_e,selection)=>runSuite(selection||{}));
 ipcMain.handle("lab:validate-target",async(_e,p)=>validateTarget(p));
 ipcMain.handle("lab:launch-game",async(_e,{emulatorPath,gamePath,fullscreen=true}={})=>{
  if(process.platform!=="win32")throw new Error("إصدار تشغيل الألعاب الحالي مخصص لـ Windows.");
  if(!emulatorPath||!gamePath)throw new Error("حدد PCSX2 وملف لعبة.");
  const exe=path.resolve(emulatorPath),game=path.resolve(gamePath);
  const [es,gs]=await Promise.all([fs.stat(exe),fs.stat(game)]);
  if(!es.isFile()||path.extname(exe).toLowerCase()!==".exe")throw new Error("ملف PCSX2 التنفيذي غير صالح.");
  if(!gs.isFile()||![".iso",".chd",".zso",".cso"].includes(path.extname(game).toLowerCase())||gs.size===0)throw new Error("صيغة اللعبة غير مدعومة أو الملف فارغ.");
  const logDir=path.join(app.getPath("userData"),"logs");await fs.mkdir(logDir,{recursive:true});
  const logPath=path.join(logDir,"pcsx2-"+Date.now()+".log");
  const args=[...(fullscreen?["-fullscreen"]:[]),"--",game];
  const child=spawn(exe,args,{cwd:path.dirname(exe),detached:true,windowsHide:false,stdio:"ignore"});
  child.once("error",err=>{if(win&&!win.isDestroyed())win.webContents.send("lab:launch-error",{gamePath:game,error:err.message});});
  child.unref();
  await fs.writeFile(logPath,["Saad PS2 Emulator launch", "Executable: "+exe,"Game: "+game,"Arguments: "+JSON.stringify(args),"Started: "+new Date().toISOString(),"PID: "+child.pid].join("\n"),"utf8");
  return{launched:true,pid:child.pid,logPath,gamePath:game,emulatorPath:exe,args};
 });
 ipcMain.handle("lab:save-report",async(_e,report)=>{const r=await dialog.showSaveDialog(win,{title:"حفظ تقرير",defaultPath:"saad-ps2-report.json",filters:[{name:"JSON",extensions:["json"]}]});if(r.canceled||!r.filePath)return{saved:false};await fs.writeFile(r.filePath,JSON.stringify(report,null,2),"utf8");return{saved:true,filePath:r.filePath};});
 ipcMain.handle("lab:open-external",async(_e,url)=>{const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw new Error("Only HTTP(S) links are allowed.");await shell.openExternal(u.toString());return true;});
 createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
