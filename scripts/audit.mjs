import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const src=join(root,'src');
const files=[];
function walk(d){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(tsx|ts)$/.test(e.name))files.push(p)}}walk(src);
const source=files.map(p=>`${p}\n${readFileSync(p,'utf8')}`).join('\n');
let errors=[];
function check(condition,message){if(!condition)errors.push(message)}
const contents=readFileSync(join(src,'lib/content.ts'),'utf8');
const expectedIds=['22246525','45281089','879535773986067585','907810186496081029','23291812','815701483202479525'];
for(const id of expectedIds)check(contents.includes(`www.airbnb.com/rooms/${id}`),`Missing exact Airbnb booking ID ${id}`);
check(contents.includes('HF37r4yoWYHWbzUZbCHB'),'Verified VenueX appointment URL not found');
check(contents.includes('https://availabledates.horseheadlakelodge.com/'),'Existing event availability URL not found');
check((contents.match(/bookUrl:/g)||[]).length===7,'The site must declare six distinct stay booking URLs plus the Stay type field');
check((contents.match(/file: '/g)||[]).length>=8,'Expected original venue photo manifest');
check(!/\b0[1-9]\s*[\/|·-]\s*(Weddings|Cabins|Stays|Celebrate|Services)/i.test(source),'Decorative numbered section labels detected');
const rendered=files.filter(p=>p.endsWith('.tsx')).map(p=>readFileSync(p,'utf8')).join('\n');
for(const phrase of ['lorem ipsum','elevate your','unforgettable experience','memories are made','luxury meets nature','migration pending','verify before launch','preview only','photo pending','placeholder'])check(!rendered.toLowerCase().includes(phrase),`Rendered code contains prohibited filler or developer copy: ${phrase}`);
const needed=['weddings','wedding-packages','the-enclave','cabins','cabins/[slug]','corporate-retreats','things-to-do','gallery','video-gallery','guest-information','contact','blog','amenities','things-to-do/restaurants','things-to-do/wineries','things-to-do/trails'];
for(const route of needed)check(existsSync(join(src,'app',route,'page.tsx')),`Missing route /${route}`);
const oldCatchAll=join(src,'app','[...slug]','page.tsx');
if(existsSync(oldCatchAll)){const text=readFileSync(oldCatchAll,'utf8');check(text.includes('notFound()')&&!text.includes('getPage'),'Old catch-all route must be replaced with a safe 404 fallback');}
check(readFileSync(join(src,'app/robots.ts'),'utf8').includes('NEXT_PUBLIC_SITE_LIVE'),'Staging robots protection missing');
if(process.env.NEXT_PUBLIC_SITE_LIVE==='true'){
  check(process.env.NEXT_PUBLIC_LOCAL_MEDIA==='true','Production launch requires NEXT_PUBLIC_LOCAL_MEDIA=true');
  for(const m of contents.matchAll(/file:\s*'([^']+)'/g))check(existsSync(join(root,'public/photos',m[1])),`Missing local photo ${m[1]}`);
  errors.push('Launch gate: migrate video, RSVP, blog and old event URLs before enabling indexing. Read LAUNCH-CHECKLIST.md');
}
if(errors.length){for(const x of errors)console.error('FAIL:',x);process.exit(1)}
console.log(`PASS: ${files.length} source files scanned; six Airbnb URLs, VenueX, calendar, 12 route files, staging robots and no flagged template copy.`);
