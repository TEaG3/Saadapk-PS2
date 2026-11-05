"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),os=require("node:os"),fs=require("node:fs/promises"),path=require("node:path"),crypto=require("node:crypto");
const {storageCheck}=require("../src/main/checks/storage.cjs"),{environmentCheck}=require("../src/main/checks/environment.cjs"),{buildReport}=require("../src/main/reports/report.cjs");
test("environment probe passes",async()=>assert.equal((await environmentCheck()).status,"PASS"));
test("storage round-trip checks 4 MiB and cleans up",async()=>{const d=await fs.mkdtemp(path.join(os.tmpdir(),"saad-lab-"));try{const r=await storageCheck(d);assert.equal(r.status,"PASS");assert.equal(r.details.bytes,4*1024*1024);assert.deepEqual(await fs.readdir(d),[]);}finally{await fs.rm(d,{recursive:true,force:true});}});
test("non-directory storage target fails",async()=>{const f=path.join(os.tmpdir(),"saad-lab-"+crypto.randomUUID());await fs.writeFile(f,"x");try{assert.equal((await storageCheck(f)).status,"FAIL");}finally{await fs.unlink(f);}});
test("report counts executed statuses",()=>assert.deepEqual(buildReport([{status:"PASS"},{status:"FAIL"},{status:"BLOCKED"}]).summary,{total:3,PASS:1,FAIL:1,BLOCKED:1,NOT_RUN:0}));
