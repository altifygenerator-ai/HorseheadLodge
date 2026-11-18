import type {Metadata} from 'next';
import {STAYS} from '@/lib/content';
import {PageIntro,StayCard} from '@/components/Shared';
export const metadata:Metadata={title:'Horsehead Lake Cabins & Glamping Stays',description:'Explore the Main Lodge, waterfall cabins and lakeside glamping at Horsehead Lake Lodge in Clarksville, Arkansas. View amenities and official Airbnb booking links.',alternates:{canonical:'/cabins'}};
export default function Cabins(){return <><PageIntro label="Cabins & stays" title="Find your place by the lake." lead="Stay in the Main Lodge, listen to the creek beside a waterfall cabin, or spend a night under the trees in one of the lakeside glamping cabins." photo="waterfall"/>
<section className="content-width section-spacing"><div className="stay-page-grid">{STAYS.map(s=><StayCard stay={s} key={s.slug}/>)}</div><div className="travel-note"><h2>A note about the property</h2><p>All six stays link to their existing Airbnb listings for current prices, availability and house rules. The waterfall is seasonal, and the road to the glamping cabins is steep. Read the notes on each accommodation before booking.</p></div></section></>}
