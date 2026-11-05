"use strict";
const fs=require("node:fs/promises"),path=require("node:path");
async function emulatorCheck(p){try{const resolved=path.resolve(p),s=await fs.stat(resolved);if(!s.isFile()||path.extname(resolved).toLowerCase()!==".exe")throw new Error("حدد ملف EXE صالحاً.");return{id:"emulator",title:"اكتشاف ملف المحاكي",status:"PASS",summary:"تم التحقق من وجود الملف التنفيذي فقط؛ لم يتم تشغيل المحاكي.",details:{path:resolved,size:s.size,launched:false}};}catch(e){return{id:"emulator",title:"اكتشاف ملف المحاكي",status:"FAIL",summary:e.message};}}
module.exports={emulatorCheck};
