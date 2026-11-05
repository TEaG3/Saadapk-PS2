"use strict";
const fs=require("node:fs/promises"),path=require("node:path"),crypto=require("node:crypto");
async function storageCheck(workspace){
 let probe=null,cleanup=true;
 try{
  const root=path.resolve(workspace),st=await fs.stat(root);if(!st.isDirectory())throw new Error("المسار المحدد ليس مجلداً.");
  probe=path.join(root,".saad-lab-probe-"+crypto.randomUUID()+".tmp");
  const payload=crypto.randomBytes(4*1024*1024);await fs.writeFile(probe,payload,{flag:"wx"});
  const back=await fs.readFile(probe);if(back.length!==payload.length||!crypto.timingSafeEqual(payload,back))throw new Error("بيانات القراءة لا تطابق ما كُتب.");
  await fs.unlink(probe);probe=null;
  return{id:"storage",title:"اختبار التخزين والقراءة",status:"PASS",summary:"كتابة وقراءة ومقارنة 4 MiB ثم حذف الملف المؤقت.",details:{bytes:payload.length,verified:true,cleanup:true,workspace:root}};
 }catch(e){if(probe)try{await fs.unlink(probe);}catch{cleanup=false;}return{id:"storage",title:"اختبار التخزين والقراءة",status:"FAIL",summary:e.message,details:{cleanup}};}
}
module.exports={storageCheck};
