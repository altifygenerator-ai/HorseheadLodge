'use client';
import {useState} from 'react';

/** Quotes preserved from the existing Horsehead Lake Lodge homepage.
 * Manual navigation avoids an intrusive auto-rotating text section. */
const quotes=[
  {name:'Samantha Welch',quote:"Such a beautiful venue and everytime I photograph here it is better then before! The owner is amazing and you couldn't ask for a more awesome view to get married in front of!"},
  {name:'Corey Miller',quote:'Best Glamping! This is a must visit. The water is so clear that I can see my Green fishing line quit a ways down! Also check out the waterfall from Horsehead Lake to Horse head creek. Looks like water straight out the faucet!'},
  {name:'Traci Barton',quote:'Horsehead Lake Lodge was the perfect setting for our daughter’s wedding! She wanted an outdoor ceremony with a view, and it offered the perfect one! We highly recommend Horsehead Lake Lodge!'},
] as const;
export function ReviewCarousel(){
  const [active,setActive]=useState(0);
  const move=(dir:number)=>setActive(i=>(i+dir+quotes.length)%quotes.length);
  return <div className="guest-review-carousel" role="region" aria-label="Guest reviews" aria-roledescription="carousel" onKeyDown={e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)}}>
    <figure className="guest-review"><blockquote>“{quotes[active].quote}”</blockquote><figcaption>— {quotes[active].name}</figcaption></figure>
    <div className="guest-review-controls"><button type="button" onClick={()=>move(-1)} aria-label="Previous guest review">‹</button><div>{quotes.map((quote,i)=><button key={quote.name} className={active===i?'is-current':''} aria-label={`Read review by ${quote.name}`} aria-pressed={active===i} type="button" onClick={()=>setActive(i)}><span/></button>)}</div><button type="button" onClick={()=>move(1)} aria-label="Next guest review">›</button></div>
  </div>;
}
