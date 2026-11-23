import type {Metadata} from 'next';
import Link from 'next/link';
import {PageIntro} from '@/components/Shared';
export const metadata:Metadata={title:'Arkansas Winery Day Trips | Horsehead Lake Lodge',description:'Winery outing ideas originally included in the Horsehead Lake Lodge visitor guide.',alternates:{canonical:'/things-to-do/wineries'}};
const names=['Mount Bethel Winery','Post Winery','Chateau Aux Arc'];
export default function Wineries(){return <><PageIntro label="Winery excursions" title="An Arkansas winery outing." lead="These wineries appear in the original Horsehead Lake Lodge excursions guide. Check each winery's current hours and tour availability before traveling."/><section className="content-width section-spacing excursion-directory">{names.map(name=><article key={name}><h2>{name}</h2><p>Featured in the lodge's original winery guide.</p></article>)}<div className="directory-note"><p>Winery suggestions are for adults of legal drinking age. This is a day-trip guide, not a winery booking service.</p><Link className="text-link" href="/things-to-do">More nearby activities</Link></div></section></>}
