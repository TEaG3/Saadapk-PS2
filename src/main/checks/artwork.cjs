"use strict";
const fs=require("node:fs/promises"),path=require("node:path");
async function artworkCheck(root){
 try{const dir=path.join(path.resolve(root),"ART"),entries=await fs.readdir(dir,{withFileTypes:true});const valid=entries.filter(x=>x.isFile()&&(/_COV\\.(jpg|jpeg|png)$/i.test(x.name)||/_ICO\\.png$/i.test(x.name)));return{id:"artwork",title:"التحقق من ART",status:"PASS",summary:"تم العثور على "+valid.length+" اسم ملف مطابق لنمط OPL. لم يتم التحقق من أبعاد الصورة في هذه النسخة.",details:{files:valid.map(x=>x.name),validation:"filenames-only"}};}
 catch(e){return{id:"artwork",title:"التحقق من ART",status:e.code==="ENOENT"?"BLOCKED":"FAIL",summary:e.code==="ENOENT"?"مجلد ART غير موجود.":e.message};}
}
module.exports={artworkCheck};
