import type {Metadata} from 'next';
import Link from 'next/link';
import {PageIntro} from '@/components/Shared';

export const metadata:Metadata={title:'Restaurants & Dining Around Horsehead Lake Lodge',description:'The original Horsehead Lake Lodge dining guide, expanded with six restaurants around Clarksville, Oark and Altus, Arkansas.',alternates:{canonical:'/things-to-do/restaurants'}};
const restaurants=[
 {name:'Oark General Store & Café',place:'Oark',description:'The historic general store has become a popular café stop for people driving the winding roads of the Ozarks.',url:'https://www.facebook.com/OarkGeneralStore/'},
 {name:'Crosswoods Restaurant & Sports Club',place:'Clarksville',description:'A Clarksville restaurant for steak, seafood and classic plates, with games and entertainment on selected nights.',url:'https://crosswoodsrestaurant.com/'},
 {name:'Alligator Ray’s',place:'Altus',description:'Cajun and Creole-inspired dishes, seafood and a lively sports-bar setting in Altus.',url:'https://alligatorrays.com/'},
 {name:'Wiederkehr Weinkeller Restaurant',place:'Wiederkehr Village',description:'A restaurant in the historic winery cellar: a natural dining stop when exploring the Altus wine region.',url:'https://www.wiederkehrwines.com/'},
 {name:'Kaspers',place:'Clarksville',description:'A family-run steakhouse on the University of the Ozarks campus, known for its steaks and traditional menu.',url:'https://www.kaspersclarksville.com/'},
 {name:'Wrecked Canoe',place:'Clarksville area',description:'A locally run gathering spot that appeared in the original lodge dining guide, with food, drinks and live music. Check its current location and schedule before visiting.',url:'https://www.facebook.com/wreckedcanoe/'},
];
export default function Restaurants(){return <>
 <PageIntro label="A guide for guests" title="A good meal after a day at the lake." lead="These six stops were included on Horsehead’s original restaurant page. Some are in Clarksville; others make sense as part of a longer drive through the River Valley."/>
 <section className="content-width section-spacing guide-dining-intro"><div><p className="section-label">Where to start</p><h2>Stay in town or make the drive.</h2></div><p>For an evening close to Clarksville, start with the town’s restaurants. If you are heading out toward Altus or Oark, it makes sense to plan a meal around the excursion. Menus, schedules and operating details can change, so check the restaurant directly before setting out.</p></section>
 <section className="guide-list-wrap"><div className="content-width"><div className="guide-place-list">{restaurants.map(place=><article className="guide-place" key={place.name}><div><p className="guide-place-location">{place.place}</p><h3>{place.name}</h3></div><p>{place.description}</p><a href={place.url} target="_blank" rel="noopener noreferrer">Restaurant details <span aria-hidden="true">↗</span></a></article>)}</div></div></section>
 <section className="content-width guide-crosslinks"><div><h2>More to see around Horsehead</h2><p>Wineries, trails and a little time on Horsehead Lake round out the visit.</p></div><div><Link className="text-link" href="/things-to-do/wineries">The winery guide</Link><Link className="text-link" href="/things-to-do">All excursions</Link></div></section>
 </>}