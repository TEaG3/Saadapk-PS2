"use strict";
const fs=require("node:fs/promises"),path=require("node:path");
async function validateTarget(p){const resolved=path.resolve(p),st=await fs.stat(resolved);if(!st.isDirectory())throw new Error("المسار ليس مجلداً.");const names=await fs.readdir(resolved);return{path:resolved,entries:names.length,hasIndex:names.includes("index.html"),hasApp:names.includes("app.js"),hasData:names.includes("data")};}
async function targetCheck(p){try{const d=await validateTarget(p);return{id:"target",title:"فحص ملفات البرنامج المستهدف",status:d.hasIndex?"PASS":"BLOCKED",summary:d.hasIndex?"تم العثور على index.html.":"لم يعثر الفحص على index.html.",details:d};}catch(e){return{id:"target",title:"فحص ملفات البرنامج المستهدف",status:"FAIL",summary:e.message};}}
module.exports={validateTarget,targetCheck};
