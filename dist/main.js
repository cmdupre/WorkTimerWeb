(()=>{"use strict";const t={getRuntimeString:t=>{let e=Math.floor(t/3600),n=Math.floor(t%3600/60),s=Math.floor(t%3600%60);return e=e<10?"0"+e:e,n=n<10?"0"+n:n,s=s<10?"0"+s:s,`${e}:${n}:${s}`},reverse:t=>t.split("").reverse().join("")};function e(e){let n=e.startTime,s=e.tempRuntime,a=e.description;function o(){return n>0?Math.floor((s+Date.now()-n)/1e3):Math.floor(s/1e3)}return{start:()=>n=Date.now(),changeRuntime:function(e){let n=0,a=0,o=0;const r=t.reverse(e);e.length>0&&(o=parseInt(t.reverse(r.substr(0,2)))),e.length>2&&(a=60*parseInt(t.reverse(r.substr(2,2)))),e.length>4&&(n=3600*parseInt(t.reverse(r.substr(4)))),s=1e3*(n+a+o)},isRunning:()=>0!==n,getDescription:()=>a,setDescription:t=>a=t,runtime:()=>t.getRuntimeString(o()),stop:function(){n>0&&(s+=Date.now()-n,n=0)},getRuntimeSeconds:o,toObject:function(){return{startTime:n,tempRuntime:s,description:a}}}}const n={create:function(t=0,n=0,s=""){return e({startTime:t,tempRuntime:n,description:s})},createFromObject:e};const s={storeTasks:function(t=null){const e=[],n=t?.getElementsByClassName("task");for(const t of n)t.task.setDescription(t.getElementsByClassName("description")[0].value),e.push(t.task.toObject());localStorage.setItem("tasks",JSON.stringify(e))},getTaskItems:()=>JSON.parse(localStorage.getItem("tasks")||"[]")},a=document.getElementById("content");let o=null,r=null,i=null;function c(t=null,e=null){if(i)return void(i=null);const n=t.target,s=n.parentElement;i=s,e(i),n.select()}function l(t){const e=t.target,n=e.parentElement;let o="";for(const t of e.value)isNaN(t)||(o+=t);n.task.changeRuntime(o),c(),s.storeTasks(a)}const u={getDiv:()=>a,createTotalizer:function(){if(r)return;const t=document.createElement("label");t.id="totalizer",t.textContent="00:00:00",t.classList.add("disabled"),a.appendChild(t),r=t},createRestoreButton:function(t=null){const e=document.createElement("button");e.id="restoreButton",e.textContent="restore",e.addEventListener("click",t),a.appendChild(e)},createStartButton:function(t=null){if(o)return;const e=document.createElement("button");e.id="startButton",e.textContent="New Task",e.classList.add("new"),e.addEventListener("click",t),a.appendChild(e),o=e},enableRunMode:function(t=null){restoreButton.removeEventListener("click",t),restoreButton.classList.add("label"),restoreButton.textContent="Total:",r.classList.remove("disabled")},createNewTask:function(t){const e=document.createElement("button");e.classList.add("timer"),null===t.task||t.task.isRunning()?(e.classList.add("stop"),e.textContent="Stop"):(e.classList.add("start"),e.textContent="Start"),e.addEventListener("click",t.toggleTimer);const n=document.createElement("button");n.classList.add("discard"),n.textContent="discard",n.addEventListener("click",t.discardTask);const r=document.createElement("input");r.classList.add("runtime"),r.placeholder="0:00:00",r.addEventListener("focusin",(e=>c(e,t.stopTask))),r.addEventListener("focusout",l);const i=document.createElement("input");i.classList.add("description"),i.placeholder="describe your task...",i.addEventListener("change",(()=>s.storeTasks(a)));const u=document.createElement("div");return u.description=i,u.classList.add("task"),u.appendChild(e),u.appendChild(n),u.appendChild(r),u.appendChild(i),a.insertBefore(u,o),i.focus(),u},updateTotalizer:function(){if(i)return;let e=0;for(const t of a.getElementsByClassName("task"))e+=t.task.getRuntimeSeconds();r.textContent=t.getRuntimeString(e)},updateRuntimes:function(){for(const t of a.getElementsByClassName("task"))t!==i&&(t.getElementsByClassName("runtime")[0].value=t.task.runtime())}};function d(){u.enableRunMode(d);for(const t of s.getTaskItems())k(0,n.createFromObject(t))}function m(t){const e=t.target,n=e.parentElement;"Stop"===e.textContent?(n.task.stop(),e.textContent="Start",e.classList.remove("stop"),e.classList.add("start")):(f(),n.task.start(),e.textContent="Stop",e.classList.remove("start"),e.classList.add("stop")),s.storeTasks(u.getDiv())}function p(t){const e=t.target.parentElement;delete e.task,u.getDiv().removeChild(e),s.storeTasks(u.getDiv())}function f(){for(const t of u.getDiv().getElementsByClassName("task"))g(t)}function g(t){t.getElementsByClassName("timer")[0].textContent="Start",t.getElementsByClassName("timer")[0].classList.remove("stop"),t.getElementsByClassName("timer")[0].classList.add("start"),t.task.stop()}function k(t,e=null){null===e&&(u.enableRunMode(d),f());const a={task:e,toggleTimer:m,discardTask:p,stopTask:g},o=u.createNewTask(a);null===e?(o.task=n.create(),o.task.start(),s.storeTasks(u.getDiv())):(o.task=e,o.description.value=o.task.getDescription())}u.createStartButton(k),u.createRestoreButton(d),u.createTotalizer(),setInterval(u.updateRuntimes,500),setInterval(u.updateTotalizer,500)})();