import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const text=['src/app/guest-information/page.tsx','src/app/video-gallery/page.tsx'].map(p=>readFileSync(join(root,p),'utf8')).join('\n');
if(/https:\/\/horseheadlakelodge\.com\/(guest-information|video-gallery)\//.test(text))throw new Error('A staging page links to a current-domain WordPress page and would loop after DNS cutover');
const files=['ceremony.jpeg','reception.jpeg','lake.jpg','lodge.webp','waterfall.jpg','glamping.jpg','bridal.jpg','enclave.jpg','walkway.jpeg'];
const absent=files.filter(f=>!existsSync(join(root,'public/photos',f)));
console.log(`Prelaunch media: ${files.length-absent.length}/${files.length} synced`);
if(absent.length){console.log('BLOCKED for public launch: sync and verify these images: '+absent.join(', '));if(process.env.NEXT_PUBLIC_SITE_LIVE==='true')process.exitCode=1;}
else console.log('All defined local media files exist; visually verify each before launch.');
