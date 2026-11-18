import type {Metadata} from 'next';
import Link from 'next/link';
import {SitePhoto} from '@/components/SitePhoto';
import {PageIntro,TextLink} from '@/components/Shared';
import {SITE} from '@/lib/content';
export const metadata:Metadata={title:'Venue, Wedding & Cabin Photo Gallery',description:'See the wedding spaces, lakeside setting, waterfall cabins and lodge at Horsehead Lake Lodge in Clarksville, Arkansas.',alternates:{canonical:'/gallery'}};
const gallery=[{photo:'ceremony',caption:'Ceremony space'},{photo:'reception',caption:'The reception hall'},{photo:'lake',caption:'The property and lake'},{photo:'lodge',caption:'The Main Lodge'},{photo:'waterfall',caption:'Waterfall cabins'},{photo:'glamping',caption:'Glamping by the lake'},{photo:'bridal',caption:'Bridal suite'},{photo:'enclave',caption:'The Enclave'}] as const;
export default function Gallery(){return <><PageIntro label="Around Horsehead" title="See the place for yourself." lead="A look at the event spaces, rooms and surroundings, using photography from the lodge's existing website."/>
<section className="content-width section-spacing"><div className="gallery-grid">{gallery.map((x,i)=><figure key={x.photo} className={i%5===0?'gallery-large':''}><SitePhoto photo={x.photo}/><figcaption>{x.caption}</figcaption></figure>)}</div><div className="gallery-bottom"><p>Want to get a better sense of the layout? An in-person tour is the best way to see how the spaces connect.</p><TextLink href={SITE.tour} external>Schedule a tour</TextLink><p className="gallery-extra"><Link href="/video-gallery">See video information →</Link></p></div></section></>}
