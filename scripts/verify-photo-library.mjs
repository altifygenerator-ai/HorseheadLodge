import {readFileSync, existsSync, statSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const data=JSON.parse(readFileSync(join(root,'src/lib/experience-photos.json'),'utf8'));
const seen=new Set();let bytes=0;
for(const photo of data.photos){
 if(!photo.id||seen.has(photo.id))throw new Error('Duplicate or missing gallery image ID: '+photo.id);
 seen.add(photo.id);
 if(!photo.alt||photo.alt.length<16)throw new Error('Missing meaningful alt text for '+photo.id);
 const path=join(root,'public',photo.src);
 if(!existsSync(path))throw new Error('Missing gallery image: '+path);
 const size=statSync(path).size;
 if(size<1000)throw new Error('Gallery image looks empty: '+path);
 bytes+=size;
}
for(const [name,ids] of Object.entries(data.featured))for(const id of ids){
 if(!seen.has(id))throw new Error(`Missing ${name} featured image: ${id}`);
}
console.log(`PASS: ${data.photos.length} first-party gallery photographs, ${Object.keys(data.featured).length} curated image sets, ${(bytes/1048576).toFixed(1)} MiB`);
