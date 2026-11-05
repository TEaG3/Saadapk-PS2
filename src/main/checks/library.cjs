"use strict";
const fs=require("node:fs/promises"),path=require("node:path");
const EXT=new Set([".iso",".zso",".chd",".cue",".bin",".img",".pbp",".vcd"]);
async function walk(dir,out=[]){for(const item of await fs.readdir(dir,{withFileTypes:true})){if(item.name.toUpperCase()==="ART")continue;const full=path.join(dir,item.name);if(item.isDirectory())await walk(full,out);else if(item.isFile()&&(EXT.has(path.extname(item.name).toLowerCase())||item.name.toLowerCase()==="ul.cfg")){const s=await fs.stat(full);out.push({path:full,name:item.name,size:s.size,extension:path.extname(item.name).toLowerCase()});}}return out;}
async function libraryCheck(root){
 try{const files=await walk(path.resolve(root)),games=files.filter(f=>EXT.has(f.extension)),zero=games.filter(f=>f.size===0),ids=games.map(f=>({file:f.name,id:(f.name.toUpperCase().match(/[A-Z]{4}[_-]\\d{3}\\.\\d{2}|[A-Z]{4}[-_]\\d{5}/)||[])[0]||null}));const missing=ids.filter(x=>!x.id).length,seen=new Set(),duplicates=[];for(const x of ids)if(x.id){if(seen.has(x.id))duplicates.push(x.id);seen.add(x.id);}return{id:"library",title:"فهرسة ملفات الألعاب",status:zero.length?"FAIL":"PASS",summary:"عُثر على "+games.length+" ملفاً؛ ملفات صفرية: "+zero.length+"؛ بلا serial في الاسم: "+missing+"؛ معرّفات مكررة: "+duplicates.length,details:{files,serialScan:ids,zeroLength:zero,duplicates}};}
 catch(e){return{id:"library",title:"فهرسة ملفات الألعاب",status:"FAIL",summary:e.message};}
}
module.exports={libraryCheck};
