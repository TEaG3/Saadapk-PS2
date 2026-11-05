"use strict";
const $=id=>document.getElementById(id);let state={workspace:null,targetPath:null,emulatorPath:null,gamePath:null,report:null};
$("chooseWorkspace").onclick=async()=>{state.workspace=await window.saadLab.chooseFolder("اختر مجلد الاختبار");$("workspace").value=state.workspace||"";};
$("chooseTarget").onclick=async()=>{state.targetPath=await window.saadLab.chooseFolder("اختر مجلد البرنامج");$("target").value=state.targetPath||"";};
$("chooseEmulator").onclick=async()=>{state.emulatorPath=await window.saadLab.chooseFile("اختر المحاكي");$("emulator").value=state.emulatorPath||"";};
$("chooseGame").onclick=async()=>{state.gamePath=await window.saadLab.chooseFile("اختر ملف لعبة PS2","game");$("game").value=state.gamePath||"";};
$("launch").onclick=async()=>{const b=$("launch");b.disabled=true;$("launchStatus").textContent="يتم تشغيل PCSX2...";try{const r=await window.saadLab.launchEmulator({emulatorPath:state.emulatorPath,gamePath:state.gamePath});$("launchStatus").textContent="انتهت العملية. Exit: "+r.exitCode+" · السجل: "+r.logPath;}catch(e){$("launchStatus").textContent="تعذر التشغيل: "+e.message;}finally{b.disabled=false;}};
$("run").onclick=async()=>{const b=$("run");b.disabled=true;$("summary").textContent="قيد التنفيذ...";try{state.report=await window.saadLab.run(state);render(state.report);$("save").disabled=false;}catch(e){$("summary").textContent="تعذر التنفيذ: "+e.message;}finally{b.disabled=false;}};
$("save").onclick=async()=>{if(state.report)await window.saadLab.saveReport(state.report);};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(r){const s=r.summary;$("summary").innerHTML="<b>اكتمل التنفيذ</b><span>نجاح: "+s.PASS+" · فشل: "+s.FAIL+" · محجوب: "+s.BLOCKED+"</span>";const cards=r.results.map(x=>'<article class="test '+x.status.toLowerCase()+'"><b>'+x.status+'</b><strong>'+esc(x.title)+'</strong><p>'+esc(x.summary)+'</p></article>').join("");$("cards").innerHTML=cards;$("resultRows").innerHTML=cards;}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(b.dataset.view).classList.add("active");document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x===b));});
