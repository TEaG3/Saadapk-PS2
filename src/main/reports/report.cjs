"use strict";
function buildReport(results,environment={}){const summary={total:results.length,PASS:0,FAIL:0,BLOCKED:0,NOT_RUN:0};for(const x of results)summary[x.status]=(summary[x.status]||0)+1;return{schemaVersion:1,application:"Saad PS2 Test Lab",generatedAt:new Date().toISOString(),environment,summary,results};}
module.exports={buildReport};
