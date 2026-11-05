"use strict";
const fs=require("node:fs/promises"),path=require("node:path");
function imageInfo(buffer,ext){
 if(ext===".png"){
  if(buffer.length<24||buffer.toString("hex",0,8)!=="89504e470d0a1a0a")throw new Error("PNG signature invalid");
  return{format:"PNG",width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
 }
 if(ext===".jpg"||ext===".jpeg"){
  if(buffer.length<4||buffer[0]!==0xff||buffer[1]!==0xd8)throw new Error("JPEG signature invalid");
  let i=2;
  while(i+9<buffer.length){
   if(buffer[i]!==0xff){i++;continue;}
   const marker=buffer[i+1],len=buffer.readUInt16BE(i+2);
   if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))
    return{format:"JPEG",height:buffer.readUInt16BE(i+5),width:buffer.readUInt16BE(i+7)};
   if(len<2)break;i+=2+len;
  }
  throw new Error("JPEG dimensions not found");
 }
 throw new Error("Unsupported image format");
}
async function artworkCheck(root){
 try{
  const dir=path.join(path.resolve(root),"ART"),entries=await fs.readdir(dir,{withFileTypes:true});
  const candidates=entries.filter(x=>x.isFile()&&(/_COV\\.(jpg|jpeg|png)$/i.test(x.name)||/_ICO\\.png$/i.test(x.name)));
  const checked=[],invalid=[];
  for(const item of candidates){
   try{const ext=path.extname(item.name).toLowerCase(),info=imageInfo(await fs.readFile(path.join(dir,item.name)),ext);
    if(!info.width||!info.height)throw new Error("Image dimensions are zero");
    checked.push({name:item.name,...info});
   }catch(e){invalid.push({name:item.name,error:e.message});}
  }
  return{id:"artwork",title:"التحقق من أغلفة OPL",status:invalid.length?"FAIL":candidates.length?"PASS":"BLOCKED",
   summary:"أسماء مطابقة: "+candidates.length+"؛ صور سليمة من ناحية الترويسة والأبعاد: "+checked.length+"؛ غير صالحة: "+invalid.length,
   details:{checked,invalid,validation:"filename-and-image-header-dimensions"}};
 }catch(e){return{id:"artwork",title:"التحقق من أغلفة OPL",status:e.code==="ENOENT"?"BLOCKED":"FAIL",summary:e.code==="ENOENT"?"مجلد ART غير موجود.":e.message};}
}
module.exports={artworkCheck,imageInfo};
