import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=readFileSync(join(root,'src/lib/content.ts'),'utf8');
const entries=[...manifest.matchAll(/file:\s*'([^']+)',\s*source:\s*'([^']+)'/g)].map(m=>({file:m[1],url:m[2]}));
if(entries.length<8)throw new Error('Media manifest missing entries.');
const dir=join(root,'public/photos');mkdirSync(dir,{recursive:true});
let failures=0;
for(const {file,url} of entries){
  if(!new URL(url).hostname.endsWith('horseheadlakelodge.com'))throw Error(`Unapproved media host: ${url}`);
  try{
    const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw Error(`HTTP ${response.status}`);
    const type=response.headers.get('content-type')||'';
    if(!type.startsWith('image/'))throw Error(`Not an image: ${type}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length<2000)throw Error('Image unusually small');
    writeFileSync(join(dir,file),bytes);
    process.stdout.write(`Saved ${file} (${(bytes.length/1024).toFixed(0)} KB)\n`);
  }catch(error){failures++;console.error(`FAILED ${file}: ${error.message}`)}
}
if(failures){console.error(`\n${failures} image(s) did not download. Keep the old site live and do not cut over DNS.`);process.exitCode=1;}
else console.log('\nOriginal images saved locally. Review rights and photography before launch. Set NEXT_PUBLIC_LOCAL_MEDIA=true to use copies.');
