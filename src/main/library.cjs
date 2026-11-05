"use strict";
const fs=require("node:fs/promises");
const path=require("node:path");
const EXT=new Set([".iso",".chd",".zso",".cso"]);
async function scanGameFolders(folders){
 const games=[],errors=[],seen=new Set();let scanned=0;
 for(const folder of folders){
  if(!folder)continue;
  const root=path.resolve(folder);
  async function walk(dir,depth){
   if(depth>12)return;
   let entries;try{entries=await fs.readdir(dir,{withFileTypes:true});}catch(e){errors.push({path:dir,error:e.message});return;}
   for(const ent of entries){
    const full=path.join(dir,ent.name);
    if(ent.isSymbolicLink())continue;
    if(ent.isDirectory()){await walk(full,depth+1);continue;}
    if(!ent.isFile()||!EXT.has(path.extname(ent.name).toLowerCase()))continue;
    scanned++;try{const st=await fs.stat(full);if(!st.size)continue;const key=full.toLowerCase();if(seen.has(key))continue;seen.add(key);games.push({name:path.basename(ent.name,path.extname(ent.name)),fileName:ent.name,path:full,size:st.size,extension:path.extname(ent.name).toLowerCase()});}catch(e){errors.push({path:full,error:e.message});}
   }
  }
  await walk(root,0);
 }
 games.sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:"base"}));
 return{games,summary:{folders:folders.length,scanned,found:games.length,errors:errors.length},errors};
}
module.exports={scanGameFolders};
