"use strict";
const os=require("node:os"),fs=require("node:fs/promises"),path=require("node:path"),crypto=require("node:crypto");
async function environmentCheck(){
 let probe;
 try{probe=path.join(os.tmpdir(),".saad-lab-"+crypto.randomUUID());await fs.writeFile(probe,"test",{flag:"wx"});const value=await fs.readFile(probe,"utf8");if(value!=="test")throw new Error("قراءة الملف المؤقت غير مطابقة.");await fs.unlink(probe);return{id:"environment",title:"بيئة التشغيل",status:"PASS",summary:"تم التحقق من نظام التشغيل والقراءة والكتابة والتنظيف.",details:{platform:process.platform,release:os.release(),arch:process.arch}};}
 catch(e){if(probe)try{await fs.unlink(probe);}catch{}return{id:"environment",title:"بيئة التشغيل",status:"FAIL",summary:e.message};}
}
module.exports={environmentCheck};
