"use strict";
const os=require("node:os");
const {environmentCheck}=require("./checks/environment.cjs");
const {storageCheck}=require("./checks/storage.cjs");
const {libraryCheck}=require("./checks/library.cjs");
const {artworkCheck}=require("./checks/artwork.cjs");
const {targetCheck}=require("./checks/target.cjs");
const {emulatorCheck}=require("./checks/emulator.cjs");
const {buildReport}=require("./reports/report.cjs");
async function runSuite(selection={}) {
 const results=[];
 const run=async fn=>{try{results.push({...await fn(),executedAt:new Date().toISOString()});}catch(e){results.push({id:"unexpected",title:"خطأ غير متوقع",status:"FAIL",summary:e.message,executedAt:new Date().toISOString()});}};
 await run(environmentCheck);
 if(selection.workspace) {
  await run(()=>storageCheck(selection.workspace));
  await run(()=>libraryCheck(selection.workspace));
  await run(()=>artworkCheck(selection.workspace));
 } else for(const [id,title] of [["storage","اختبار التخزين"],["library","فهرسة الألعاب"],["artwork","التحقق من ART"]])results.push({id,title,status:"BLOCKED",summary:"اختر مجلد الاختبار أولاً."});
 if(selection.targetPath)await run(()=>targetCheck(selection.targetPath));else results.push({id:"target",title:"ملفات البرنامج المستهدف",status:"BLOCKED",summary:"لم يتم تحديد مجلد."});
 if(selection.emulatorPath)await run(()=>emulatorCheck(selection.emulatorPath));else results.push({id:"emulator",title:"اكتشاف المحاكي",status:"BLOCKED",summary:"لم يتم تحديد ملف المحاكي."});
 return buildReport(results,{platform:process.platform,release:os.release(),workspace:selection.workspace||null});
}
module.exports={runSuite};
