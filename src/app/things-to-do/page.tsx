import Link from 'next/link';
import type {Metadata} from 'next';
import {ExperienceCarousel} from '@/components/ExperienceCarousel';
import {ExperienceImage} from '@/components/ExperienceImage';
import {featured} from '@/lib/experience';
import {PageIntro} from '@/components/Shared';
export const metadata:Metadata={title:'Things to Do Around Horsehead Lake Lodge',description:'Discover the lake, waterfall, Ozark hikes, local restaurants and the wineries of Altus and Wiederkehr Village.',alternates:{canonical:'/things-to-do'}};
const guides=[
 {title:'Arkansas wine country',description:'The original lodge guide’s Altus wineries, with useful links for planning a tasting-room visit.',href:'/things-to-do/wineries',link:'Explore the wineries'},
 {title:'Restaurants along the way',description:'Six places from the original dining guide, from Clarksville to Oark and Altus.',href:'/things-to-do/restaurants',link:'Where to eat'},
 {title:'Hiking & waterfalls',description:'Horsehead Creek and the wider Ozark trails, including the original day-trip suggestions.',href:'/things-to-do/trails',link:'Explore the trails'},
];
export default function ThingsToDo(){return <>
 <PageIntro label="Explore the area" title="Out on the water. Into the Ozarks." lead="You can spend the whole day at Horsehead Lake. Or take a drive for a trail, a good meal, or a stop in Arkansas wine country." photo="lake"/>
 <section className="content-width section-spacing guide-editorial"><div className="guide-editorial-copy"><p className="section-label">Start here</p><h2>A lake right outside your door.</h2><p>Take a kayak or canoe out, walk down to the water, or spend a slow morning on the dock. The creek spillway is close to the Waterfall Cabins, although its flow depends on rainfall.</p><p>Ask the team about current on-property access and conditions before setting out.</p><Link href="/amenities" className="text-link">On-site amenities</Link></div><ExperienceCarousel ids={featured.setting} label="Scenery around Horsehead Lake Lodge" className="guide-editorial-carousel"/></section>
 <section className="excursion-guide-panel"><div className="content-width"><div className="guide-heading"><p className="section-label">Beyond the property</p><h2>Choose the kind of day you want.</h2></div><div className="excursion-guide-grid">{guides.map(item=><article key={item.href}><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href} className="text-link">{item.link}</Link></article>)}</div></div></section>
 <section className="content-width section-spacing excursion-picture-feature"><ExperienceImage id="img-8775" sizes="(max-width:900px) 100vw,55vw"/><div><p className="section-label">Stay a little longer</p><h2>There is no need to do everything in one afternoon.</h2><p>Cabins by the waterfall, stays under the trees, and the Main Lodge give guests different ways to enjoy the same setting.</p><Link className="text-link" href="/cabins">Explore the accommodations</Link></div></section>
 </>}