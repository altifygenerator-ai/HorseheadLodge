import type {Metadata} from 'next';
import Link from 'next/link';
import {PageIntro} from '@/components/Shared';
import {SITE} from '@/lib/content';
export const metadata:Metadata={title:'Horsehead Lake Lodge Videos',description:'Explore the photos and arrange a tour to see Horsehead Lake Lodge, its wedding spaces, and lakeside accommodations.',alternates:{canonical:'/video-gallery'}};
export default function VideoGallery(){return <><PageIntro label="Video gallery" title="See the venue in person." lead="The current video collection is being migrated. In the meantime, browse the photo gallery or arrange a tour."/><section className="content-width section-spacing simple-body"><h2>Plan your visit</h2><p>Take a look through photographs of the wedding and event spaces, cabins and lakeside grounds. You can also book an in-person tour with the lodge.</p><div className="actions"><Link className="button button-outline" href="/gallery">View photo gallery</Link><a href={SITE.tour} target="_blank" rel="noopener noreferrer" className="button button-dark">Book a tour</a></div></section></>}
