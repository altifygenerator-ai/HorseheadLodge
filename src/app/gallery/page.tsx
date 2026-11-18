import type {Metadata} from 'next';
import Link from 'next/link';
import {VenueGallery,type GalleryImage} from '@/components/VenueGallery';
import {PageIntro,TextLink} from '@/components/Shared';
import {SITE} from '@/lib/content';
export const metadata:Metadata={title:'Venue, Wedding & Cabin Photo Gallery',description:'See the wedding spaces, lakeside setting, waterfall cabins and lodge at Horsehead Lake Lodge in Clarksville, Arkansas.',alternates:{canonical:'/gallery'}};
const gallery:GalleryImage[]=[
 {photo:'ceremony',caption:'Ceremony deck',category:'Wedding spaces'},
 {photo:'reception',caption:'Reception hall',category:'Wedding spaces'},
 {photo:'walkway',caption:'Connecting walkway',category:'Wedding spaces'},
 {photo:'bridal',caption:'Bridal suite',category:'Wedding spaces'},
 {photo:'lake',caption:'Horsehead Lake and grounds',category:'The property'},
 {photo:'lodge',caption:'The Main Lodge',category:'Accommodations'},
 {photo:'waterfall',caption:'Waterfall cabins',category:'Accommodations'},
 {photo:'glamping',caption:'Glamping cabins',category:'Accommodations'},
 {photo:'enclave',caption:'The Enclave',category:'The Enclave'},
 {photo:'enclaveRoom',caption:'The Enclave interior',category:'The Enclave'},
 {photo:'enclaveView',caption:'The Enclave views',category:'The Enclave'},
 {photo:'enclaveSetting',caption:'The Enclave event setting',category:'The Enclave'},
 {photo:'enclaveDetails',caption:'The Enclave details',category:'The Enclave'},
];
export default function Gallery(){return <><PageIntro label="Around Horsehead" title="See the place for yourself." lead="A look at the event spaces, rooms and surroundings, using photography from the lodge's existing website."/>
<section className="content-width section-spacing"><VenueGallery images={gallery}/><div className="gallery-bottom"><p>Want to get a better sense of the layout? An in-person tour is the best way to see how the spaces connect.</p><TextLink href={SITE.tour} external>Schedule a tour</TextLink><p className="gallery-extra"><Link href="/video-gallery">See video information →</Link></p></div></section></>}
