import type {Metadata} from 'next';
import Link from 'next/link';
import {ExperienceCarousel} from '@/components/ExperienceCarousel';
import {featured} from '@/lib/experience';
import {PageIntro} from '@/components/Shared';

export const metadata:Metadata={title:'Arkansas Winery Excursions from Horsehead Lake Lodge',description:'Plan a visit to the Altus wine country while staying at Horsehead Lake Lodge. Explore Mount Bethel Winery, Post Winery, Chateau Aux Arc and Wiederkehr Wine Cellars.',alternates:{canonical:'/things-to-do/wineries'}};
const wineries=[
 {name:'Mount Bethel Winery',place:'Altus, Arkansas',description:'A family winery with a long Post-family winemaking history. Visit the cellar, learn about the vineyard, and see what is currently offered in the tasting room.',url:'https://www.mountbethel.com/'},
 {name:'Post Winery',place:'Altus, Arkansas',description:'A historic Arkansas winery known for its Muscadine wines. The original lodge guide highlights its retail shop and the Trellis Room.',url:'https://postwinery.com/'},
 {name:'Chateau Aux Arc',place:'Altus, Arkansas',description:'An Altus vineyard established by Audrey House, with a focus on grapes grown in Arkansas. Check visitor information directly before planning a tasting.',url:'https://www.chateauauxarc.com/'},
 {name:'Wiederkehr Wine Cellars',place:'Wiederkehr Village, Arkansas',description:'An additional wine-country stop featured in the lodge’s original dining guide. Its historic cellar, shop and Weinkeller restaurant connect a visit with a meal.',url:'https://www.wiederkehrwines.com/'},
];
export default function Wineries(){return <>
 <PageIntro label="Out in the River Valley" title="A day in Arkansas wine country." lead="The lodge’s original visitor guide points guests toward the wineries around Altus. These are places to explore on a day away from the lake, not businesses on the lodge grounds."/>
 <section className="content-width section-spacing guide-editorial"><div className="guide-editorial-copy"><p className="section-label">The drive is part of the day</p><h2>Take the scenic route. Leave room to linger.</h2><p>Altus and nearby Wiederkehr Village have a long winemaking history. Browse each winery’s own website for tours, tasting-room hours and current visitor arrangements.</p><p>Plan a designated driver if you will be tasting wine. The lodge does not provide a winery shuttle or make tasting reservations through this website.</p></div><ExperienceCarousel ids={featured.setting} label="Horsehead Lake scenery before your winery day trip" className="guide-editorial-carousel"/></section>
 <section className="guide-list-wrap"><div className="content-width"><div className="guide-heading"><p className="section-label">Places to visit</p><h2>Wineries from the original lodge guide.</h2></div><div className="guide-place-list">{wineries.map(win=> <article className="guide-place" key={win.name}><div><p className="guide-place-location">{win.place}</p><h3>{win.name}</h3></div><p>{win.description}</p><a href={win.url} target="_blank" rel="noopener noreferrer">Visit winery website <span aria-hidden="true">↗</span></a></article>)}</div></div></section>
 <section className="content-width guide-crosslinks"><div><h2>Back at the lake</h2><p>Spend the following morning on the dock, by the waterfall, or exploring the trails around Horsehead Lake.</p></div><div><Link className="text-link" href="/things-to-do/trails">Hiking &amp; waterfalls</Link><Link className="text-link" href="/cabins">Find a cabin</Link></div></section>
 </>}