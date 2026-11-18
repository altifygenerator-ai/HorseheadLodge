import type {Metadata} from 'next';
import Link from 'next/link';
import {PageIntro} from '@/components/Shared';
import {SITE} from '@/lib/content';
export const metadata:Metadata={title:'Horsehead Lake Lodge Videos',description:'Explore the photo gallery and arrange a tour to see Horsehead Lake Lodge, its wedding spaces, and lakeside accommodations.',alternates:{canonical:'/video-gallery'}};
export default function VideoGallery(){return <><PageIntro label="Video gallery" title="See the spaces before you visit." lead="Explore the lodge, wedding venue and lakeside setting as you plan your visit."/><section className="content-width section-spacing simple-body"><h2>Take a closer look.</h2><p>Browse photographs of the wedding and event spaces, cabins and lake. If you would like a walkthrough, get in touch with the lodge or book a tour.</p><div className="actions"><Link className="button button-outline" href="/gallery">View photo gallery</Link><a href={SITE.tour} target="_blank" rel="noopener noreferrer" className="button button-dark">Book a tour</a></div></section></>}
