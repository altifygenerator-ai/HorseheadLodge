import type {Metadata} from 'next';
import Link from 'next/link';
import {VideoFeature} from '@/components/VideoFeature';
import {ExperienceImage} from '@/components/ExperienceImage';
import {SITE} from '@/lib/content';
export const metadata:Metadata={title:'Wedding Films & Lake Experiences | Horsehead Lake Lodge',description:'Watch real wedding films and a waterfall-cabin visit filmed at Horsehead Lake Lodge in Clarksville, Arkansas.',alternates:{canonical:'/video-gallery'}};
export default function VideoGallery(){return <>
<header className="experience-gallery-header"><div className="content-width"><p className="section-label">Films from Horsehead</p><h1>See the place in motion.</h1><p>A photo can show you the view. These films give you a closer look at celebrations, the lake and the kind of weekend you can spend here.</p></div></header>
<section className="content-width section-spacing video-collection">
 <div className="video-collection-feature"><div><p className="section-label">Wedding films</p><h2>Real celebrations at Horsehead.</h2><p>See how the ceremony spaces, lake and reception come together. These films were independently published by the credited filmmakers.</p></div>
 <VideoFeature videoId="dcqyySknUgg" title="Rose & Daniel — A wedding at Horsehead Lake Lodge" credit="Film by Wild Bloom Films" /></div>
 <div className="video-collection-secondary"><VideoFeature videoId="aAHhcv0chHc" title="Kole & Kaden — Arkansas wedding film" credit="Film by Hunt Films" /><VideoFeature videoId="tTy_rpJ74qU" title="A stay by the Horsehead waterfall" credit="Travel video by Kelly Hays; independent creator" /></div>
 <div className="video-feature-link"><p><strong>More from a real celebration:</strong> <a href="https://vimeo.com/1151683961" target="_blank" rel="noopener noreferrer">Madison &amp; Garren’s wedding film by Topher Films</a>.</p><p>Visit the <a href="https://www.youtube.com/channel/UCb8g5lrxpIb41_nVb3DWXdQ" target="_blank" rel="noopener noreferrer">Horsehead Lake Lodge YouTube channel</a> for videos published by the property.</p></div>
</section>
<section className="video-visit-band"><ExperienceImage id="img-5564" sizes="(max-width: 850px) 100vw, 60vw" /><div><p className="section-label">Visit the property</p><h2>The best view is still in person.</h2><p>Come see the ceremony spaces, the indoor halls and the lake for yourself.</p><a className="button button-dark" href={SITE.tour} target="_blank" rel="noopener noreferrer">Schedule a tour</a><Link href="/gallery" className="text-link">View the photo gallery</Link></div></section>
</>}
