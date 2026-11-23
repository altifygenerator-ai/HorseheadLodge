import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const read=path=>readFileSync(join(root,path),'utf8');
const checks=[
 ['Home has an automatically advancing real-photo hero',read('src/app/page.tsx').includes('<PhotoCarousel hero autoPlay')],
 ['Home retains a browsable venue slideshow',read('src/app/page.tsx').includes('venue-showcase')],
 ['Home retains rotating guest testimonials',read('src/app/page.tsx').includes('<ReviewCarousel')],
 ['Wedding page retains venue images',read('src/app/weddings/page.tsx').includes('wedding-slideshow')],
 ['Enclave uses its own original-site image series',read('src/app/the-enclave/page.tsx').includes('enclave-slideshow')],
 ['Gallery supports opening images',read('src/components/VenueGallery.tsx').includes('setActive(i)')],
 ['Gallery supports keyboard close',read('src/components/VenueGallery.tsx').includes("event.key==='Escape'")],
 ['Carousel has previous / next controls',read('src/components/PhotoCarousel.tsx').includes('Previous photograph')&&read('src/components/PhotoCarousel.tsx').includes('Next photograph')],
 ['Carousel has touch swipe',read('src/components/PhotoCarousel.tsx').includes('onTouchEnd')],
 ['Autoplay pauses in background',read('src/components/PhotoCarousel.tsx').includes('visibilitychange')],
 ['Reduced motion stops autoplay',read('src/components/PhotoCarousel.tsx').includes('prefers-reduced-motion')],
 ['Carousel styles support phones',read('src/app/style.css').includes('.hero-slideshow .photo-carousel')&&read('src/app/style.css').includes('@media(max-width:700px)')],
 ['The five Enclave originals are referenced',read('src/lib/content.ts').includes('IMG_0701-scaled.jpg')&&read('src/lib/content.ts').includes('IMG_0695.jpg')],
 ['Production media cutover gate scans all sources',read('scripts/prelaunch-check.mjs').includes('content.matchAll')],
 ['Default venue slides autoplay while retaining manual arrows',read('src/components/PhotoCarousel.tsx').includes('autoPlay=true,intervalMs=6500')&&read('src/components/PhotoCarousel.tsx').includes('Previous photograph')],
 ['Home has a real venue wedding-film component',read('src/app/page.tsx').includes('<VideoFeature videoId=')],
 ['Video page has a privacy-enhanced embed on activation',read('src/components/VideoFeature.tsx').includes('youtube-nocookie.com/embed/')],
 ['Original short wedding package rates carried forward',read('src/app/wedding-packages/page.tsx').includes('2,900')&&read('src/app/wedding-packages/page.tsx').includes('1,900')],
 ['Original area guide routes preserved by redirects',read('next.config.ts').includes("source:'/winery'")&&read('next.config.ts').includes("source:'/restaurant'")],
 ['Concierge cannot automatically email',read('scripts/concierge-triage.mjs').includes('autoSend:false')],
 ['Site stays noindex in staging',read('src/app/layout.tsx').includes('index:isLive')],
];
let failed=0;
for(const [name,okay] of checks){console.log(`${okay?'PASS':'FAIL'} ${name}`);if(!okay)failed++}
if(failed){console.error(`${failed} user interface safeguard(s) failed`);process.exitCode=1}
else console.log(`PASS: ${checks.length} design/interaction regression checks.`)
