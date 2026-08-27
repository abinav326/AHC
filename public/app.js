async function loadContent(){
  try{
    const res=await fetch("/api/content");
    const data=await res.json();
    renderEquipment(data.equipment||[]);
    renderActivities(data.activities||[]);
  }catch(e){
    document.querySelector("#equipmentGrid").innerHTML='<p class="loading">Unable to load content.</p>';
    document.querySelector("#activityGrid").innerHTML='<p class="loading">Unable to load content.</p>';
  }
}
function renderEquipment(items){
  const el=document.querySelector("#equipmentGrid");
  if(!items.length){el.innerHTML='<div class="empty"><b>Equipment photos coming soon.</b><span>The gym owner can add equipment from the admin panel.</span></div>';return;}
  el.innerHTML=items.map(x=>`
    <article class="gallery-card">
      <div class="photo">${x.photos?.[0]?`<img src="${x.photos[0]}" alt="${esc(x.name)}">`:"<div class='no-photo'>AHC</div>"}</div>
      <div class="gallery-info"><span>EQUIPMENT</span><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p>
      ${x.photos?.length>1?`<small>${x.photos.length} photos</small>`:""}</div>
    </article>`).join("");
}
function renderActivities(items){
  const el=document.querySelector("#activityGrid");
  if(!items.length){el.innerHTML='<div class="empty"><b>Activities will appear here.</b><span>Challenges, events and programs can be uploaded by the owner.</span></div>';return;}
  el.innerHTML=items.map(x=>`
    <article class="activity-card">
      <div class="activity-photo">${x.photos?.[0]?`<img src="${x.photos[0]}" alt="${esc(x.title)}">`:"<div class='no-photo'>AHC</div>"}</div>
      <div class="activity-info"><span>${x.date?formatDate(x.date):"AHC ACTIVITY"}</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></div>
    </article>`).join("");
}
function formatDate(v){const d=new Date(v+"T00:00:00");return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}).toUpperCase()}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
loadContent();