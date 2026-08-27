let pass="";
async function login(){
  pass=document.querySelector("#password").value;
  const r=await fetch("/api/content");
  if(!r.ok){alert("Server error");return}
  document.querySelector("#login").hidden=true;
  document.querySelector("#dashboard").hidden=false;
  refresh();
}
function showTab(tab,btn){
  document.querySelector("#equipmentTab").hidden=tab!=="equipment";
  document.querySelector("#activitiesTab").hidden=tab!=="activities";
  document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
}
async function refresh(){
  const r=await fetch("/api/content"); const d=await r.json();
  renderList("equipmentList",d.equipment||[],"equipment");
  renderList("activityList",d.activities||[],"activities");
}
function renderList(id,items,type){
  const el=document.getElementById(id);
  if(!items.length){el.innerHTML="<p style='color:#666'>Nothing added yet.</p>";return}
  el.innerHTML=items.map(x=>`<div class="item"><div><h3>${esc(type==="equipment"?x.name:x.title)}</h3><div class="thumbs">${(x.photos||[]).map(p=>`<img src="${p}">`).join("")}</div></div><button class="delete" onclick="removeItem('${type}','${x.id}')">DELETE</button></div>`).join("");
}
async function removeItem(type,id){
  if(!confirm("Delete this item and its uploaded photos?"))return;
  const r=await fetch(`/api/${type}/${id}`,{method:"DELETE",headers:{"x-admin-password":pass}});
  const d=await r.json();
  if(!r.ok){alert(d.error||"Delete failed");return}
  refresh();
}
document.querySelector("#equipmentForm").addEventListener("submit",e=>submitForm(e,"equipment"));
document.querySelector("#activityForm").addEventListener("submit",e=>submitForm(e,"activities"));
async function submitForm(e,type){
  e.preventDefault();
  const form=e.currentTarget;
  const r=await fetch(`/api/${type}`,{method:"POST",headers:{"x-admin-password":pass},body:new FormData(form)});
  const d=await r.json();
  if(!r.ok){alert(d.error||"Upload failed");return}
  alert("Published successfully!");
  form.reset();refresh();
}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}