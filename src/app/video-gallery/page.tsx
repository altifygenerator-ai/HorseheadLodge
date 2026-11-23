import type {Metadata} from 'next';
import Link from 'next/link';
import {PageIntro,VisitCTA} from '@/components/Shared';
import {VideoFeature} from '@/components/VideoFeature';
export const metadata:Metadata={title:'Wedding Films & Video Tours | Horsehead Lake Lodge',description:'Watch a real wedding film at Horsehead Lake Lodge in Clarksville, Arkansas and find the venue’s YouTube channel.',alternates:{canonical:'/video-gallery'}};
export default function VideoGallery(){return <><PageIntro label="Video gallery" title="See what a day at Horsehead looks like." lead="Photography tells part of the story. A wedding film shows the setting, the ceremony and the people gathering here."/>
<section className="content-width section-spacing video-gallery-layout"><div><p className="section-label">Wedding film</p><h2>Rose & Daniel at Horsehead Lake Lodge</h2><p>This public wedding film was made at the venue and published by Wild Bloom Films in 2022. It provides a look at a real celebration, not a staged virtual tour.</p><p>We are separately inventorying the video embeds and 360° tours from the original WordPress site before launch so that they are preserved rather than replaced with unrelated footage.</p><div className="actions"><a className="text-link" href="https://www.youtube.com/channel/UCb8g5lrxpIb41_nVb3DWXdQ" target="_blank" rel="noopener noreferrer">Horsehead Lake Lodge on YouTube</a><Link className="text-link" href="/gallery">See venue photographs</Link></div></div>
<VideoFeature videoId="dcqyySknUgg" title="Rose & Daniel — Horsehead Lake Lodge" credit="Film by Wild Bloom Films" /></section>
<VisitCTA heading="Come see the venue in person." copy="Photos and films are a start. See the ceremony and reception spaces on a tour."/></>}
