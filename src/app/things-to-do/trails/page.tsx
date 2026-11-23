import type {Metadata} from 'next';
import Link from 'next/link';
import {ExperienceCarousel} from '@/components/ExperienceCarousel';
import {featured} from '@/lib/experience';
import {PageIntro} from '@/components/Shared';

export const metadata:Metadata={title:'Hiking Trails & Waterfalls Near Horsehead Lake Lodge',description:'Explore Horsehead Creek spillway and Ozark day-trip ideas including Pam’s Grotto, Hawksbill Crag and Glory Hole Falls. Check current trail conditions before you go.',alternates:{canonical:'/things-to-do/trails'}};
const outings=[
 {name:'Horsehead Creek spillway',type:'On the property',description:'The waterfall near the Waterfall Cabins runs strongest after rainfall. Water levels and footing change, so ask the lodge about safe access.'},
 {name:'Pam’s Grotto',type:'Ozark National Forest outing',description:'A waterfall and rock shelter referenced in the lodge’s original hiking guide. Check route information and waterfall flow before leaving.'},
 {name:'Hawksbill Crag / Whitaker Point',type:'Longer Ozark day trip',description:'An iconic bluff overlook near the Upper Buffalo region. This is a separate hiking outing, not a short walk from the lodge.'},
 {name:'Glory Hole Falls',type:'Longer Ozark day trip',description:'A distinctive waterfall flowing through an opening in the rock near Ozone. Expect changing conditions on the approach trail.'},
 {name:'Spy Rock',type:'Longer regional outing',description:'The original lodge guide also mentioned an Ouachita hiking route to Spy Rock. Plan this separately from the trails around Horsehead Lake.'},
];
export default function Trails(){return <>
 <PageIntro label="The Ozark outdoors" title="Creekside mornings. Long trails. Waterfalls after rain." lead="Start with Horsehead Lake and its spillway, then look farther afield for a full day on an Arkansas trail. The original lodge guide named several regional outings." photo="waterfall"/>
 <section className="content-width section-spacing guide-editorial"><div className="guide-editorial-copy"><p className="section-label">Right here at Horsehead</p><h2>The waterfall changes with the weather.</h2><p>The spillway beside the Waterfall Cabins is one of the property's most recognizable views. After a rainy spell it can be dramatic; in dry weather it may be much quieter.</p><p>Ask the lodge about access before exploring, and avoid entering fast water or slippery rock areas.</p></div><ExperienceCarousel ids={featured.setting} label="Horsehead Lake and woodland views" className="guide-editorial-carousel"/></section>
 <section className="guide-list-wrap"><div className="content-width"><div className="guide-heading"><p className="section-label">From the original excursion guide</p><h2>Five places to consider.</h2></div><div className="guide-place-list">{outings.map(place=><article className="guide-place" key={place.name}><div><p className="guide-place-location">{place.type}</p><h3>{place.name}</h3></div><p>{place.description}</p><span className="guide-place-static">Check official trail information</span></article>)}</div><p className="guide-safety-note">Longer hikes can involve remote roads and limited mobile coverage. Check the U.S. Forest Service for current trail and road conditions, and plan travel times separately.</p></div></section>
 <section className="content-width guide-crosslinks"><div><h2>Come back to the lake.</h2><p>Choose a cabin close to the trails and water, or plan an easy day around the lodge.</p></div><div><Link className="text-link" href="/cabins">All cabin stays</Link><Link className="text-link" href="/things-to-do">More excursions</Link></div></section>
 </>}