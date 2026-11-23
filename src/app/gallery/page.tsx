import type {Metadata} from 'next';
import Link from 'next/link';
import {ExperienceGallery} from '@/components/ExperienceGallery';
import {ExperienceCarousel} from '@/components/ExperienceCarousel';
import {featured} from '@/lib/experience';
import {SITE} from '@/lib/content';

export const metadata:Metadata={
 title:'Photo Gallery | Weddings, Lake Views & Lodging in Clarksville, AR',
 description:'Explore real photos of Horsehead Lake Lodge: lakeside ceremonies, celebrations, the reception hall, cabins, the waterfall and the Ozark landscape.',
 alternates:{canonical:'/gallery'},
};
export default function Gallery(){return <>
 <header className="experience-gallery-header"><div className="content-width"><p className="section-label">Around Horsehead Lake Lodge</p><h1>Take a look around.</h1><p>From a quiet morning on the lake to a room filled with family and friends, these are the places and moments that make Horsehead what it is.</p></div></header>
 <div className="gallery-leading"><ExperienceCarousel ids={featured.setting} label="Horsehead Lake and the surrounding property"/></div>
 <section className="content-width experience-gallery-section"><div className="experience-gallery-title"><div><p className="section-label">The photo collection</p><h2>See the property, the spaces and the celebrations.</h2></div><p>Browse photographs from the property and real weddings held here. Choose an area to explore, or see everything.</p></div><ExperienceGallery/></section>
 <section className="experience-gallery-closing"><div className="content-width"><h2>Photographs are a start. See the property in person.</h2><p>Come walk the ceremony spaces, look out over the water, and talk through what you have in mind.</p><div className="actions"><a className="button button-dark" href={SITE.tour} target="_blank" rel="noopener noreferrer">Schedule a tour</a><Link href="/video-gallery" className="text-link">Watch the films</Link></div></div></section>
 </>}
