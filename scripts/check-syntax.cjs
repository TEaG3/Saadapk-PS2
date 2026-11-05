"use strict";
const cp=require("node:child_process");
const files=["electron/main.cjs","electron/preload.cjs","src/main/runner.cjs","src/main/library.cjs","src/main/checks/environment.cjs","src/main/checks/storage.cjs","src/main/checks/library.cjs","src/main/checks/artwork.cjs","src/main/checks/target.cjs","src/main/checks/emulator.cjs","src/main/reports/report.cjs","src/shared/result-schema.cjs","src/renderer/app.js"];
for(const file of files)cp.execFileSync(process.execPath,["--check",file],{stdio:"inherit"});
console.log("Syntax OK:",files.length,"files");
