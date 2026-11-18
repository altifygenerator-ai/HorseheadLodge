import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE } from '@/lib/content';
import { SitePhoto } from '@/components/SitePhoto';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { TextLink, VisitCTA } from '@/components/Shared';

export const metadata: Metadata = {
  title: 'Horsehead Lake Lodge & Event Center | Clarksville, Arkansas',
  description: 'Weddings, celebrations and lakeside stays at Horsehead Lake Lodge in Clarksville, Arkansas. See the ceremony deck, reception hall, cabins and tour information.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return <>
    <section className="home-hero">
      <div className="hero-photo-wrap"><PhotoCarousel hero autoPlay label="Views of the Horsehead Lake Lodge venue" className="hero-slideshow" slides={[{photo:"ceremony",caption:"Lakeside ceremony deck"},{photo:"reception",caption:"Reception hall"},{photo:"lake",caption:"Horsehead Lake"},{photo:"walkway",caption:"Connecting walkway"}]} /></div>
      <div className="hero-text">
        <p className="hero-overline">Clarksville, Arkansas</p>
        <h1>Horsehead Lake Lodge<br /><span>&amp; Event Center</span></h1>
        <p className="hero-copy">A place to gather, celebrate and stay overlooking Horsehead Lake in the Arkansas Ozarks.</p>
        <div className="hero-actions"><a href={SITE.tour} target="_blank" rel="noopener noreferrer" className="button button-cream">Book a tour</a><Link className="button button-outline hero-secondary" href="/weddings">Explore the venue</Link></div>
      </div>
    </section>

    <nav className="home-quick-nav" aria-label="Plan your visit">
      <Link href="/weddings"><strong>Weddings</strong><span>See the ceremony and reception spaces</span></Link>
      <Link href="/cabins"><strong>Cabins</strong><span>Find a place to stay by the lake</span></Link>
      <Link href="/the-enclave"><strong>The Enclave</strong><span>Explore smaller gatherings</span></Link>
    </nav>

    <section className="narrow-intro section-spacing">
      <p className="section-label">Welcome to Horsehead Lake Lodge</p>
      <h2>A wedding and event venue with a view worth sharing.</h2>
      <p>Set on 72 acres near the Ozark National Forest, Horsehead Lake Lodge brings the ceremony, reception and time together into one lakeside setting. Come see the property and decide if it feels right for your day.</p>
      <TextLink href="/weddings">See the wedding venue</TextLink>
    </section>

    <section className="feature-block content-width section-spacing feature-first">
      <SitePhoto photo="reception" className="feature-photo" />
      <div className="feature-copy">
        <p className="section-label">Weddings at Horsehead</p>
        <h2>Your ceremony, reception and weekend in one place.</h2>
        <p>Exchange vows overlooking Horsehead Lake, celebrate in the reception hall, and make time for the people who traveled to be there. The ceremony hall and rooftop sky deck are part of the venue experience.</p>
        <div className="actions"><TextLink href="/weddings">Explore weddings</TextLink><TextLink href="/wedding-packages">Wedding packages</TextLink></div>
      </div>
    </section>

    <section className="venue-gallery section-spacing">
      <div className="content-width"><div className="section-heading-row"><div><p className="section-label">The ceremony spaces</p><h2>See where the day unfolds.</h2><p>Take a closer look at the ceremony deck, reception hall, and lakeside setting.</p></div><TextLink href="/gallery">View all photographs</TextLink></div>
        <PhotoCarousel label="Explore the ceremony and reception spaces" className="venue-showcase" showThumbnails slides={[{photo:"ceremony",caption:"Ceremony deck"},{photo:"reception",caption:"Reception hall"},{photo:"walkway",caption:"Connecting walkway"},{photo:"bridal",caption:"Bridal suite"},{photo:"lake",caption:"Horsehead Lake"}]} />
      </div>
    </section>

    <section className="stays-section section-spacing"><div className="content-width">
      <div className="section-heading-row"><div><p className="section-label">Stay at Horsehead</p><h2>Stay a little longer.</h2><p>From the Main Lodge to the waterfall and glamping cabins, there are several ways to enjoy the lake.</p></div><TextLink href="/cabins">View accommodations</TextLink></div>
      <div className="home-stay-grid">
        <Link className="home-stay-large" href="/cabins/main-lodge"><SitePhoto photo="lodge" /><div className="home-stay-caption"><h3>The Main Lodge</h3><span>See the lodge →</span></div></Link>
        <div className="home-stay-side"><Link href="/cabins/waterfall-cabin-1"><SitePhoto photo="waterfall" /><div><h3>Waterfall Cabins</h3><span>View cabins →</span></div></Link><Link href="/cabins/glamping-cabin-1"><SitePhoto photo="glamping" /><div><h3>Glamping Cabins</h3><span>View cabins →</span></div></Link></div>
      </div></div></section>

    <section className="enclave-feature"><div className="content-width enclave-inner"><PhotoCarousel className="enclave-photo" label="Photographs of The Enclave" slides={[{photo:"enclave",caption:"The Enclave"},{photo:"enclaveRoom",caption:"Inside The Enclave"},{photo:"enclaveView",caption:"Enclave views"},{photo:"enclaveSetting",caption:"Event setting"},{photo:"enclaveDetails",caption:"Venue details"}]} /><div><p className="section-label light-label">The Enclave</p><h2>A place for smaller celebrations.</h2><p>The Enclave is the lodge's separate event setting for gatherings of up to 50 guests. Explore the space, available options and current details.</p><TextLink href="/the-enclave">Explore The Enclave</TextLink></div></div></section>

    <section className="review-section section-spacing"><div className="content-width"><p className="section-label">What guests are saying</p><ReviewCarousel /></div></section>
    <VisitCTA />
  </>;
}
