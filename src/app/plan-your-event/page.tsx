import type {Metadata} from 'next';
import Link from 'next/link';
import {SITE} from '@/lib/content';
import {ExperienceCarousel} from '@/components/ExperienceCarousel';
import {featured} from '@/lib/experience';

export const metadata:Metadata={
 title:'Plan Your Wedding or Event | Dates, Tours & Booking',
 description:'How to inquire about a Horsehead Lake Lodge wedding, private celebration or corporate event. See published package prices, request dates and schedule a venue tour.',
 alternates:{canonical:'/plan-your-event'}
};

export default function PlanYourEvent(){return <>
 <section className="event-plan-intro">
  <div className="content-width event-plan-intro-inner">
   <div><p className="section-label">Planning a celebration</p><h1>Start with a date. Come see the place.</h1>
    <p>Whether it is a full wedding weekend, a smaller gathering at The Enclave or a team retreat, the first step is finding a time that works and talking through the space with Horsehead.</p>
    <div className="event-plan-actions"><a className="button button-dark" href={SITE.dates} target="_blank" rel="noopener noreferrer">Browse event dates ↗</a><a className="button button-outline" href={SITE.tour} target="_blank" rel="noopener noreferrer">Schedule a tour ↗</a></div>
   </div>
   <ExperienceCarousel ids={featured.ceremony} label="Real wedding ceremonies and event spaces at Horsehead" className="event-plan-photos"/>
  </div>
 </section>
 <section className="content-width event-plan-steps">
  <div className="event-plan-steps-title"><p className="section-label">How to begin</p><h2>Three useful places to start.</h2></div>
  <div className="event-plan-steps-list">
   <article><span className="event-plan-kicker">Event dates</span><h3>See the public availability calendar.</h3><p>Horsehead publishes available date windows and indicative prices on its existing calendar. A displayed opening is not a reservation or a hold; confirm your preferred dates directly with the venue.</p><a href={SITE.dates} target="_blank" rel="noopener noreferrer" className="text-link">Open the event calendar ↗</a></article>
   <article><span className="event-plan-kicker">Find the fit</span><h3>Compare the published event packages.</h3><p>Horsehead lists weekend, weekday and shorter wedding options. Pricing, accommodations and payment terms should be confirmed with the team for your event.</p><Link href="/wedding-packages" className="text-link">See packages &amp; starting rates</Link></article>
   <article><span className="event-plan-kicker">Visit</span><h3>Walk through the venue.</h3><p>Use the existing tour scheduler to arrange a time to see the halls, ceremony spaces and lake. The venue team can discuss your guest count and which spaces suit your plans.</p><a href={SITE.tour} target="_blank" rel="noopener noreferrer" className="text-link">Choose a tour time ↗</a></article>
  </div>
 </section>
 <section className="event-plan-questions"><div className="content-width event-plan-questions-inner">
  <div><p className="section-label">Published details</p><h2>Useful things to know before you call.</h2><p>These details are based on Horsehead's current public website. The venue confirms final quotes, conditions and reservation terms.</p></div>
  <div className="event-plan-facts">
   <article><h3>Weekend celebrations</h3><p>{SITE.eventInquiry ? 'Browse open dates to see the price for your wedding weekend.' : 'The published full-weekend wedding package starts at $9,900, with Friday noon through Sunday at 10 a.m. access.'}</p></article>
   <article><h3>Weekday weddings</h3><p>{SITE.eventInquiry ? 'See the calendar for available weekday packages and dates.' : 'The published longer weekday wedding package starts at $6,900, Monday at noon through Thursday at 10 a.m.'}</p></article>
   <article><h3>Smaller gatherings</h3><p>{SITE.eventInquiry ? 'The Enclave is a separate space for smaller gatherings.' : 'The Enclave is advertised for gatherings up to 50 guests, with published rental rates from $800 and a ceremony-space option from $1,900.'}</p></article>
   <article><h3>Cabins and guest rooms</h3><p>Wedding-package lodging differs from independently booked stays. Ask which spaces and accommodations are included in the event package you are considering.</p></article>
  </div>
 </div></section>
 <section className="content-width event-plan-next"><div><p className="section-label">Ready to ask about a date?</p><h2>Talk to the venue before making plans around a date.</h2><p>The availability calendar lists <a href={'mailto:'+SITE.eventInquiryEmail}>{SITE.eventInquiryEmail}</a> for date-hold questions. A hold is only confirmed by the venue, not by using this website.</p></div><div className="event-plan-next-links"><a className="button button-dark" href={SITE.eventInquiry ?? ('mailto:'+SITE.eventInquiryEmail+'?subject=Horsehead%20Lake%20Lodge%20event%20date%20inquiry')}>Ask about an event date ↗</a><Link href="/contact" className="text-link">Other ways to reach Horsehead</Link></div></section>
 </>}