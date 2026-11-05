"use strict";
const STATUSES=Object.freeze(["PASS","FAIL","BLOCKED","NOT_RUN"]);
function validateResult(row){if(!row||typeof row!=="object")throw new TypeError("Test result must be an object.");if(!STATUSES.includes(row.status))throw new TypeError("Unknown status.");if(!row.id||!row.title)throw new TypeError("id and title are required.");return row;}
module.exports={STATUSES,validateResult};
