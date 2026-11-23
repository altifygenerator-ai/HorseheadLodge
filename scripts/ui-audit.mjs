import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const read=path=>readFileSync(join(root,path),'utf8');
const home=read('src/app/page.tsx');
const carousel=read('src/components/ExperienceCarousel.tsx');
const gallery=read('src/components/ExperienceGallery.tsx');
const checks=[
 ['Home uses the original-photos automatically rotating hero',home.includes('<ExperienceCarousel hero')&&home.includes('featured.hero')],
 ['Home retains browsable real-photo venue slideshow',home.includes('venue-showcase')&&home.includes('featured.ceremony')],
 ['Home retains guest testimonials',home.includes('<ReviewCarousel')],
 ['Wedding page uses the curated ceremony and reception sets',read('src/app/weddings/page.tsx').includes('featured.ceremony')&&read('src/app/weddings/page.tsx').includes('featured.reception')],
 ['Enclave keeps its original-site photo series',read('src/app/the-enclave/page.tsx').includes('enclave-slideshow')],
 ['New gallery opens larger images',gallery.includes('setActive(index)')],
 ['Gallery uses category filters',gallery.includes('experienceCategories')&&gallery.includes('applyFilter')],
 ['Gallery supports keyboard close',gallery.includes("e.key==='Escape'")],
 ['Carousel has previous and next controls',carousel.includes('Previous image:')&&carousel.includes('Next image:')],
 ['Carousel has touch-swipe interaction',carousel.includes('onTouchEnd')],
 ['Carousel autoplay pauses when page is hidden',carousel.includes('visibilitychange')],
 ['Carousel disables autoplay for reduced motion',carousel.includes('prefers-reduced-motion')],
 ['Carousel styles adapt to small screens',read('src/app/style.css').includes('.experience-carousel-hero')&&read('src/app/style.css').includes('@media(max-width:600px)')],
 ['Five Enclave originals remain referenced',read('src/lib/content.ts').includes('IMG_0701-scaled.jpg')&&read('src/lib/content.ts').includes('IMG_0695.jpg')],
 ['Existing media cutover check retained',read('scripts/prelaunch-check.mjs').includes('content.matchAll')],
 ['Venue photo carousel retains manual controls and autoplay',read('src/components/PhotoCarousel.tsx').includes('autoPlay=true,intervalMs=6500')&&read('src/components/PhotoCarousel.tsx').includes('Previous photograph')],
 ['The original home wedding film remains',home.includes('<VideoFeature videoId=')],
 ['YouTube embeds load after deliberate interaction',read('src/components/VideoFeature.tsx').includes('youtube-nocookie.com/embed/')],
 ['Additional verified venue films are credited',read('src/app/video-gallery/page.tsx').includes('Wild Bloom Films')&&read('src/app/video-gallery/page.tsx').includes('Hunt Films')],
 ['No unverified 360 URL is invented',read('docs/VIDEO-AND-360-RECOVERY.md').includes('not recoverable')],
 ['Original shorter wedding package rates remain',read('src/app/wedding-packages/page.tsx').includes('2,900')&&read('src/app/wedding-packages/page.tsx').includes('1,900')],
 ['Older guide redirects remain in place',read('next.config.ts').includes("source:'/winery'")&&read('next.config.ts').includes("source:'/restaurant'")],
 ['Concierge cannot automatically email',read('scripts/concierge-triage.mjs').includes('autoSend:false')],
 ['Staging remains noindex',read('src/app/layout.tsx').includes('index:isLive')],
 ['Desktop dropdowns open and dismiss on hover and outside click',read('src/components/SiteHeader.tsx').includes('onMouseEnter={show}')&&read('src/components/SiteHeader.tsx').includes('onMouseLeave={hideAfterPointerLeave}')&&read('src/components/SiteHeader.tsx').includes("document.addEventListener('pointerdown',onOutside)")],
 ['Desktop dropdowns close on blur and Escape',read('src/components/SiteHeader.tsx').includes('onBlurCapture=')&&read('src/components/SiteHeader.tsx').includes("event.key==='Escape'")],
 ['Desktop dropdown animations respect reduced motion',read('src/app/style.css').includes('.desktop-nav .nav-dropdown.is-open .nav-dropdown-panel')&&read('src/app/style.css').includes('.desktop-nav .nav-dropdown-panel')&&read('src/app/style.css').includes('.desktop-nav .nav-dropdown-trigger,')],
 ['Navigation exposes winery, cabin, and wedding guides',read('src/components/SiteHeader.tsx').includes('Wineries')&&read('src/components/SiteHeader.tsx').includes('Waterfall cabins')&&read('src/components/SiteHeader.tsx').includes('Wedding packages')],
 ['Winery guide includes all three original wineries',read('src/app/things-to-do/wineries/page.tsx').includes('Mount Bethel Winery')&&read('src/app/things-to-do/wineries/page.tsx').includes('Post Winery')&&read('src/app/things-to-do/wineries/page.tsx').includes('Chateau Aux Arc')],
 ['Dining guide restores all six original suggestions',read('src/app/things-to-do/restaurants/page.tsx').includes('Oark General Store')&&read('src/app/things-to-do/restaurants/page.tsx').includes('Kaspers')&&read('src/app/things-to-do/restaurants/page.tsx').includes('Wrecked Canoe')],
 ['The Waterfall and Glamping hubs keep their arrival cautions',read('src/app/cabins/waterfall-cabins/page.tsx').includes('bathroom accessed separately from outside')&&read('src/app/cabins/glamping-cabins/page.tsx').includes('road down to the glamping cabins is steep')],
 ['Gallery showcases multiple automatically rotating real-photo sets',read('src/app/gallery/page.tsx').includes('featured.ceremony')&&read('src/app/gallery/page.tsx').includes('featured.weddingMoments')],
 ['First-party venue photo files exist',existsSync(join(root,'public/photos/experience/img-1435.webp'))],
];
let failed=0;
for(const [name,okay] of checks){console.log(`${okay?'PASS':'FAIL'} ${name}`);if(!okay)failed++}
if(failed){console.error(`${failed} UI safeguard(s) failed`);process.exitCode=1}
else console.log(`PASS: ${checks.length} design and interaction regression checks.`);
