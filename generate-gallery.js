const fs=require('fs'),path=require('path');
const pub=path.join(__dirname,'public');
function imgs(folder){const d=path.join(pub,folder);return fs.readdirSync(d).filter(x=>/\.(jpg|jpeg|png|webp|gif|avif)$/i.test(x)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(x=>`/${folder}/${encodeURIComponent(x)}`)}
fs.writeFileSync(path.join(pub,'gallery.json'),JSON.stringify({equipment:imgs('equipment'),activities:imgs('activities')},null,2));
